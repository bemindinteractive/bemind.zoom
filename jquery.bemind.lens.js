
; (function ($, window, document, undefined) {

    $.widget("bemind.lens", {
        options: {
            mode: 'trigger',
            boundingBox: null
        },
        _create: function () {
            var self = this;

            this.lens = $('<div/>').addClass('lens');
            this.src = this.element.find("img").attr("src");

            var native = new Image();
            $(native).bind('load', function (data) {

                var native_image = data.currentTarget;

                self.lens.css({ "background-image": "url('" + self.src + "')" });

                self.native_width = native_image.width;
                self.native_height = native_image.height;

                self.container_width = self.element.width();
                self.container_height = self.element.height();

                if (self.native_width > self.element.width()) {
                    self.element.append(self.lens);
                    self.lens_height = self.lens.height();
                    self.lens_width = self.lens.width();

                    self.element.bind('mousemove', $.proxy(self.onMouseMove, self));
                }
            });
            native.src = this.src;
        },
        // Common 
        onMouseMove: function (e) {
            var container_offset = this.element.offset();
            var mousex = e.pageX - container_offset.left;
            var mousey = e.pageY - container_offset.top;

            if (this._checkPosition(mousex, mousey)) {
                this.lens.fadeIn(100);
            }
            else {
                this.lens.fadeOut(100);
            }

            if (this.lens.is(":visible")) {
                var rx = Math.round(mousex / this.container_width * this.native_width - this.lens_width / 2) * -1;
                var ry = Math.round(mousey / this.container_height * this.native_height - this.lens_height / 2) * -1;

                var px = mousex - this.lens_width / 2;
                var py = mousey - this.lens_height / 2;

                this.lens.css({ left: px, top: py, backgroundPosition: rx + "px " + ry + "px" });
            }
        },
        _checkPosition: function (mousex, mousey) {

            var show = true;
            var top = 0;
            var left = 0;
            var bottom = this.container_height;
            var right = this.container_width;
           
            if (this.options.boundingBox) {
                if (this.options.boundingBox.position == "center") {
                    left = (this.container_width - this.options.boundingBox.width) / 2;
                    right = left + this.options.boundingBox.width;
                }
            }

            if (mousex < right && mousex > left && mousey > top && mousey < bottom) {
                return true;
            }
            else {
                return false;
            }
        },
        refresh: function () {

        },
        _setOptions: function (options) {
            this._super(options);
            this.refresh();
        },
        _destroy: function () {
            this.element.remove(".lens");
        }
    });

})(jQuery, window, document);
