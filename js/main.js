
$(function () {

	setTimeout(function(){ 
		$("#inicio").addClass( "d-none" );
        $("#menu").removeClass( "d-none" );; 
	}, 3000);


    $("#b1").click(function () {
        $("#inicio").addClass( "d-none" );
        $("#menu").addClass( "d-none" );
        $("#juego").removeClass( "d-none" );
        $("#instrucciones").addClass( "d-none" );
        $("#creditos").addClass( "d-none" );
    });

    $("#b2").click(function () {
        $("#inicio").addClass( "d-none" );
        $("#menu").addClass( "d-none" );
        $("#juego").addClass( "d-none" );
        $("#instrucciones").removeClass( "d-none" );
        $("#creditos").addClass( "d-none" );
    });

    $("#b3").click(function () {
        $("#inicio").addClass( "d-none" );
        $("#menu").addClass( "d-none" );
        $("#juego").addClass( "d-none" );
        $("#instrucciones").addClass( "d-none" );
        $("#creditos").removeClass( "d-none" );
    });

$(".b4").click(function () {
        $("#inicio").addClass( "d-none" );
        $("#menu").removeClass( "d-none" );
        $("#juego").addClass( "d-none" );
        $("#instrucciones").addClass( "d-none" );
        $("#creditos").addClass( "d-none" );
    });


});
