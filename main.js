$(document).ready(function(){

  $('.searchbutton').click(function(e){
    e.preventDefault();
    e.stopPropagation();
    var input = $('.searchit').val();

    if (input === '') {
      $('.searchit').addClass('error');
      alert('Search field cannot be blank');
    }
    else if(input !== ''){
      $('.searchit').removeClass('error');
      window.location.href='savedsearches.html';
      return false;
    }
  });
});
