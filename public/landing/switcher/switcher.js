
jQuery(function($) {

    var switcherHtml = [];
    var colorName1 = { "default": "Pink", "cornflowerblue" : "Corn Flower Blue", "green": "Green", "lightblue": "Light Blue", "mintgreen" :"Mint Green", "purple" : "Purple" };
    var colorName2 = { "default" : "Dark Sky Blue", "green" : "Green", "orange" : "Orange", "purple" : "Purple", "red" : "Red", "yellow" : "Yellow" };



    switcherHtml.push( '<div class="cbx-switcher-area">' );
    switcherHtml.push( '<div class="cbx-switcher-inner">' );
    switcherHtml.push( '<a id="cbx-switcher-btn" class="cbx-switcher-btn" href="#"><span class="fa fa-cog fa-spin" aria-hidden="true"></span></a>' );
    switcherHtml.push( '<div id="cbx-switcher-body" class="cbx-switcher-body cbx-hide">' );
    switcherHtml.push( '<span class="cbx-switcher-text text-center" > Style Switcher</span>' );
    switcherHtml.push( '<ul class="list-unstyled clearfix cbx-switcher-list">' );

    switcherHtml.push( '</ul>' );

    switcherHtml.push( '<select id="layoutswitch" class="form-control">');
    switcherHtml.push( '<option value="index.html">Style1</option>');
    switcherHtml.push( '<option value="index-2.html">Style2</option>');
    switcherHtml.push( '</select>' );

    switcherHtml.push( '</div></div></div>' );


    $.fn.SwitcherLoader = function() {
        var $this = $( this );
        $this.html( switcherHtml.join( '' ) );


        var $styleLinker     = $( '#cbx-style' );  // stylesheet id
        var $styleLayout     = parseInt($styleLinker.data('layout'));

        switch($styleLayout) {

            case 2:
                $.each( colorName2, function (index, value) {
                    $('.cbx-switcher-list').append( '<li class="cbx-list-' + index + '"><a title="' + value + '" href="#"  class="cbx-switcher-clr-btn" data-color-name="-' + index + '"></a></li>' );
                });
                $('#layoutswitch').val('index-2.html');
                break;
            default:
                $.each( colorName1, function (index, value) {
                    $('.cbx-switcher-list').append( '<li class="cbx-list-' + index + '"><a title="' + value + '" href="#"  class="cbx-switcher-clr-btn" data-color-name="-' + index + '"></a></li>' );
                });

                $('#layoutswitch').val('index.html');
        }






        var showSwitcher = true;
        $this.find("#cbx-switcher-btn").on('click', function(evt){
            evt.preventDefault();

            if ( showSwitcher ) {
                $("#cbx-switcher-body").animate({
                    right: 0
                }, 500);
                showSwitcher = !showSwitcher;
            } else {
                $("#cbx-switcher-body").animate({
                    right: -280
                }, 500);
                showSwitcher = !showSwitcher;
            }




        });



        //lz-theme-style
        $( 'a.cbx-switcher-clr-btn').on( 'click', function (e) {
            e.preventDefault();

            var $this = $( this );
            $styleLinker.attr( 'href', 'assets/css/style'+$styleLayout+ $this.data( 'color-name' ) + '.min.css' );

        });

        $('#layoutswitch').on('change', function (e) {
            e.preventDefault();

            var  $layout = $(this).val();

            window.location = $layout;


        });


    }


});


//initialize the switcher
jQuery(document).ready(function($){

    //add the switcher holder div
    $(document.body).append('<div class="switcher-loader"></div>');


    //Load Style Switcher
    if( $( '.switcher-loader').length ) {
        $( '.switcher-loader').SwitcherLoader();
    }
});