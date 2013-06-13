var Backbone = require('backbone'),
    _ = require('underscore'),
    FormView = require('lib/views/post/form').FormView,
    $ = require('jquery'),
    fileExif = require('lib/jquery.exif'),
    DialogView = require('lib/views/post/dialog').DialogView

    
var PostApp = Backbone.View.extend({
    
    initialize: function() {
        _.bindAll(this, 'getGeoData');
        
        var that = this;
        
        this.form = new FormView({el: $('#postForm')});
        
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(this.positionSuccess, this.positionError);
        } else {
            this.positionError(-1);
        }
        
        var takePicture = document.querySelector("#take-picture");
    
        if (takePicture) {
            // Set events
            takePicture.onchange = function(event) {
                // Get a reference to the taken picture or chosen file
                var files = event.target.files,
                    file;
                if (files && files.length > 0) {
                    file = files[0];
                    if (file.type.indexOf('image') !== -1) {
                        $(this).fileExif(that.getGeoData);
                    }
                    
                    that.form.image.name = file.name;
                    try {
                        var fileReader = new FileReader();
                        fileReader.onload = function(event) {
                            that.form.image.data = event.target.result;
                        };
                        fileReader.readAsDataURL(file);
                    } catch (e) {
                        alert("Neither createObjectURL or FileReader are supported");
                    }
                }
            }
        }        
    },
    
    parseDate: function(str) {
        var date;
        if (str && (str = str.match(/^(\d{4}):(0[1-9]|1[0-2]):(0[1-9]|[12]\d|3[01])\s(0[0-9]|1[0-9]|2[0-4]):([0-6][0-9]):([0-6][0-9])/))) {
            date = new Date(str[1], parseInt(str[2])-1, str[3], str[4], str[5], str[6], 0);
            return JSON.stringify(date).replace(/\"/g, '');
        }
    },
    
    getGeoData: function(exifData) {
        var aLat = exifData['GPSLatitude'],
            aLong = exifData['GPSLongitude'],
            date = this.parseDate(exifData['DateTimeOriginal']),
            that = this
        
        if (!(aLat && aLong)) return;
        
        var strLatRef = exifData['GPSLatitudeRef'] || "N";  
        var strLongRef = exifData['GPSLongitudeRef'] || "W";  
        var fLat = (aLat[0] + aLat[1]/60 + aLat[2]/3600) * (strLatRef == "N" ? 1 : -1);  
        var fLong = (aLong[0] + aLong[1]/60 + aLong[2]/3600) * (strLongRef == "W" ? -1 : 1);
        
        var modal = new DialogView({el: $('#confirmModal')});
        
        modal.bind('update', function(confirm){
            if (confirm) {
                that.form.setFields(fLat, fLong, date);
            }
        });
    },
    
    positionError: function(err) {
        var msg;
        switch (err.code) {
        case err.UNKNOWN_ERROR:
            msg = "Unable to find your location";
            break;
        case err.PERMISSION_DENINED:
            msg = "Permission denied in finding your location";
            break;
        case err.POSITION_UNAVAILABLE:
            msg = "Your location is currently unknown";
            break;
        case err.BREAK:
            msg = "Attempt to find location took too long";
            break;
        default:
            msg = "Location detection not supported in browser";
        }
        //document.getElementById('info').innerHTML = msg;
        alert(msg);
    },
    
    positionSuccess: function(position) {
        var coords = position.coords || position.coordinate || position;
        var latElem = document.getElementById("lat");
        var lonElem = document.getElementById("lon");
        
        latElem.value = coords.latitude;
        lonElem.value = coords.longitude;
    }
});


exports.PostApp = new PostApp({el: $('body')});