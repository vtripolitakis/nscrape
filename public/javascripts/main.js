$(document).ready(function(){
	
	$('.url').each(function () {
    var $this = $(this);
    $this.on("click", function () {
    	$.get('http://localhost:5000/parse?selector=article&link='+$(this).data('url'),function(data)
		{
			$('div.koko').html(data)
		});        
    });
});

});
