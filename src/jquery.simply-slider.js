
+(function (window) {

    'use strict';

    var $ = window.jQuery;
    
    if (typeof $ === 'undefined') {
        throw 'jQuery required';
    }
    
    var defaults = {
            'rows'              :   1,
            'columns'           :   3,
            'width'             :   330,
            'height'            :   100,
            'imageTemplater'    :   function (image) {} 
        },
        toString = Object.prototype.toString,
        arrayStrType = '[object Array]';
    
    $.fn.simplySlider = function (images, options) {
        if (!toString.call(images) === arrayStrType) {
            throw 'required array of images';
        }
    
        // support only one element in selector for one time!
        var el = this[0];
        
        return new SimplyScroller($(el), images, options);
    };
    
    function SimplyScroller ($elem, images, options) {
        this.$container = $elem;
        this.images = images;
        this.imagesLength = images.length;
        
        this.isBusy = false;
        
        this.options = $.extend(defaults, options);
        this.currentPage = 0;
        this.pageSize = this.options.rows * this.options.columns;
        this.maxPages = parseInt(images.length / this.pageSize);
        
        this._contsructSlider();
    }
    
    SimplyScroller.prototype._contsructSlider = function () {
        if (this.options.width < 270) {
            this.options.width = 270;
        }
    
        this.$container
            .addClass('simply-slider')
            .css({
                'width'     : this.options.width + 'px',
                'height'    : this.options.height + 'px'
            });
        
        this.$leftArrow = $('<div></div>', { 
            'class' : 'slider-arrow slider-right-arrow',
            'html'  : '<div>&lt;</div>'
        }).on('click', $.proxy(this._slideLeft, this));
        
        this.$rightArrow = $('<div></div>', { 
            'class' : 'slider-arrow slider-left-arrow',
            'html'  : '<div>&gt;</div>'
        }).on('click', $.proxy(this._slideRight, this));
        
        this.$slider = $('<div></div>', { 
            'class' : 'slider',
            'html'  : '&nbsp;' 
        });
        
        this.$container
            .empty()
            .append(this.$leftArrow)
            .append(this.$slider)
            .append(this.$rightArrow);
            
        this._render();
    };
    
    SimplyScroller.prototype._render = function () {
        var ctx = this;
        
        this.$slider.empty().stop().animate({'opacity':1}, 500, function () {
            ctx.isBusy = false;
        });
    
        var code = [],
            pageSize = this.pageSize,
            isNoFirst = false;
    
        for (var i = this.currentPage * pageSize, fringe = i + pageSize;
                i < fringe && i < this.imagesLength;
                ++i) {
                
            if (i && isNoFirst && i % this.options.columns === 0) {
                code.push('<br />'); // TODO: replace with float & clear !
            }   
            
            code.push(this.options.imageTemplater(this.images[i]));
                
            if (!isNoFirst) isNoFirst = true;
        }
        
        this.$slider.html(code.join(''));
                
    };
    
    SimplyScroller.prototype._slideLeft = function () {
        if (this.isBusy || this.currentPage == 0) {
            return false;
        }
        
        animateWrapper.call(this, function () {
            --this.currentPage;
        });
    };
    
    SimplyScroller.prototype._slideRight = function () {
        if (this.isBusy || this.currentPage == this.maxPages) {
            return false;
        }
        
        animateWrapper.call(this, function () {
            ++this.currentPage;
        });
    };
    
    function animateWrapper (callback) {
        var ctx = this;
        this.isBusy = true;
        this.$slider.stop().animate({ 'opacity' : 0 }, 500, function () {
            callback.call(ctx);
            ctx._render();
        });
    }

})(this)


