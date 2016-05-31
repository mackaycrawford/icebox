Template.listRecipes.onRendered(function() {
  console.log('onRendered');
  Meteor.call('listRecipes', function(err,res){
    console.log(err)
    console.log(res)
    displayRecipeList(res)
    
  })
  
  
  displayRecipeList = function(recipeCollection){
      for(var i = 0; i< recipeCollection.length; i++){
        if(recipeCollection[i]['favorite'] == false){
          $("#recipeList").append("<li class='list-group-item notFave'><a href='viewRecipe?recipe=" + recipeCollection[i]['_id'] +"'>"+ recipeCollection[i]['itemName']+"</a></li>")
        }
        else{
                    $("#recipeList").append("<li class='list-group-item'><a href='viewRecipe?recipe=" + recipeCollection[i]['_id'] +"'>"+ recipeCollection[i]['itemName']+"</a><span class='glyphicon glyphicon-fire pull-right favoriteIcon' aria-hidden='true'></span></li>")

        }
      }
  }
  
  $(document).ready(function(){
    $("#showFavorites").on('click', function(){
                if($("#showFavorites").is(':checked')){
              $(".notFave").hide()
          } else {
              $(".notFave").show()
          }
    })
    
            $("#clearFavorites").click(function(){
          Meteor.call('clearFavorites', function(err,res){
            console.log("CALLED")
            console.log(err)
            console.log(res)
            $(".favoriteIcon").hide()
          })
        })
  })
  
});