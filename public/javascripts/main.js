$(document).ready(function(){
	
	$('.url').each(function () {
    var $this = $(this);
    $this.on("click", function () {
    	$.get('http://localhost:5000/parse?selector='+$(this).data('selector')+'&link='+$(this).data('url')+'&toRemove='+$(this).data('toremove'),function(data)
		{
			$('div.rightColumn').html(data)
		});        
    });
});

});
