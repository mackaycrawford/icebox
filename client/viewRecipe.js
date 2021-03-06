Template.viewRecipe.onRendered(function() {
  getRecipe = function() {
    thisRecipeName = queryString()['recipe'];

    if (typeof(thisRecipeName) != "undefined") {
      Meteor.call('getRecipe', thisRecipeName, function(err, res) {
        $("#recipeName").val(res['itemName']);

        if (res['recipeURL'] != null) {
          $("#recipeURL").val(res['recipeURL'])
        }


        $("#instructionsText").val(res['comments']);
        if (res['favorite'] == true) {
          $('#favoriteFlag').attr('checked', 'checked');
        } else {
          $('#favoriteFlag').removeAttr('checked');
        }
        //$('#favoriteFlag').attr('checked', 'checked');
        for (var y = 0; y < res['ingredients'].length; y++) {
          if (res['ingredients'][y]['purchased'] == true) {
            appendIngredient(res['ingredients'][y]['item'], true);
          } else {
            appendIngredient(res['ingredients'][y]['item']);
          }

        }
        switchModes();
        $("#deleteRecipe").show()
        return res;
      })
    } else {
      console.log("NEW")
      $('#editModeFlag').prop('checked', true);
      switchModes()
        //makeEditable()
      $("#deleteRecipe").hide()
    }

  }

  makeReadOnly = function() {
    $("#recipeName").attr('disabled', 'disabled');
    $("#recipeURL").attr('disabled', 'disabled');
    $(".ingredientText").attr('disabled', 'disabled');
    $("#instructionsText").attr('disabled', 'disabled');
    $(".removeIngredientButton").hide();
    $("#addIngredientRow").hide();
    $(".haveInventoryColumn").show();
    showInstructionsAsText()
    showRecipeURLAsText()
  }

  makeEditable = function() {
    $("#recipeName").attr('disabled', false);
    $("#recipeURL").attr('disabled', false);
    $(".ingredientText").attr('disabled', false);
    $("#instructionsText").attr('disabled', false);
    $(".removeIngredientButton").show();
    $("#addIngredientRow").show();
    $(".haveInventoryColumn").hide();
    hideInstructionsAsText()
    hideRecipeURLAsText()
  }

  switchModes = function() {
    if ($("#editModeFlag").is(':checked')) {
      makeEditable();
    } else {
      makeReadOnly();
    }
  }


  hideInstructionsAsText = function() {
    console.log("hideInstructionsAsText")
    $("#instructionsText").show()
    $("#instructionsAsText").hide()
  }

  showInstructionsAsText = function() {
    console.log("showInstructionsAsText")
    it = $("#instructionsText").val();

    console.log("value to copy")
    console.log(it)
    $("#instructionsText").hide()
    $("#instructionsAsText").show()
    $("#instructionsAsText").html(it)
  }

  showRecipeURLAsText = function() {
    console.log("recipeURLAsText")
    ru = $("#recipeURL").val();
    if(ru.length > 5){
        
        console.log("here comes ru")
        console.log(typeof(ru))
        console.log(ru)
      ru = "<a href='" + ru + "' target='_blank'> Recipe URL </a>";  
    } else {
        ru = "None"
    }
        
    console.log("value to copy")
    console.log(ru)
    $("#recipeURL").hide()
    $("#recipeURLAsText").show()
    $("#recipeURLAsText").html(ru)
  }
  
hideRecipeURLAsText = function() {
    console.log("hideRecipeURLAsText")
    $("#recipeURL").show()
    $("#recipeURLAsText").hide()
  }

  assembleJSON = function() {
    outputObject = {}
    outputObject['itemName'] = $("#recipeName").val();
    outputObject['comments'] = $("#instructionsText").val();
    outputObject['recipeURL'] = $("#recipeURL").val();
    outputObject['favorite'] = $("#favoriteFlag").is(':checked');
    outputObject['ingredients'] = []

    $(".ingredientText").each(function(index) {
      miniObj = {};

      miniObj['purchased'];
      s = $(this).parent().parent().find("#haveInventoryFlag").is(':checked');
      console.log(s);
      miniObj['item'] = $(this).val();
      miniObj['purchased'] = s;
      outputObject['ingredients'].push(miniObj);
    });

    console.log(outputObject);
    return outputObject;
  }


  appendIngredient = function(ingredientName, isChecked = null) {

    if (isChecked == true) {
      aString = "<div class='row ingredientRow'><div class='col-xs-8'><input type='text' value='" + ingredientName + "'class='form-control ingredientText'> </div><div class='col-xs-4'><button class='button btn btn-danger removeIngredientButton'>Remove</button></div><div class='col-xs-4 haveInventoryColumn'><div class='checkbox'><label><input type='checkbox' checked value='' id='haveInventoryFlag'><span class='glyphicon glyphicon-shopping-cart' aria-hidden='true'></span></label></div></div></div>";

    } else {
      aString = "<div class='row ingredientRow'><div class='col-xs-8'><input type='text' value='" + ingredientName + "'class='form-control ingredientText'> </div><div class='col-xs-4'><button class='button btn btn-danger removeIngredientButton'>Remove</button></div><div class='col-xs-4 haveInventoryColumn'><div class='checkbox'><label><input type='checkbox' value='' id='haveInventoryFlag'><span class='glyphicon glyphicon-shopping-cart' aria-hidden='true'></span></label></div></div></div>";
    }
    $("#ingredientsList").append(aString);
  }

  removeIngredientListener = function() {
    $(".removeIngredientButton").on('click', function() {
      console.log("HI");
      console.log($(this).parent().parent());
      $(this).parent().parent().remove()
    });
  }




  $(document).ready(function() {
    getRecipe();


    switchModes();
    $("#editModeFlag").on('change', function() {
      switchModes()
    })


    removeIngredientListener();

    $("#editModeFlag").on('change', function() {
      switchModes()
    })
    $("#test").click(function() {
      console.log(recipes);
      postRecipes(JSON.stringify(recipes));
    })

    $("#newIngredientButton").click(function() {
      newIngredient = $("#newIngredientText").val()
      appendIngredient(newIngredient);
      $("#newIngredientText").val("");
      switchModes();
      removeIngredientListener();
    })

    $("input").keypress(function(event) {
      if (event.which == 13) {
        newIngredient = $("#newIngredientText").val()
        appendIngredient(newIngredient);
        $("#newIngredientText").val("");
        switchModes();
        removeIngredientListener();
      }
    });


    $("#saveButton").click(function() {
      newJSON = assembleJSON();

      if (queryString()['recipe'] == undefined) {
        console.log("NEW");
        createRecipe(newJSON)
      } else {
        console.log("EXISTING");
        updateRecipe(queryString()['recipe'], newJSON)
      }


    })

    $("#deleteRecipe").click(function() {
      deleteRecipe(queryString()['recipe'])
      Router.go("listRecipes")
    })



  })
});
