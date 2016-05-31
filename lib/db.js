recipes = new Mongo.Collection("recipes");

testRecipe =  {"itemName": "Daves Fried Rice", "favorite": true, "comments": "This is how you make it", "ingredients": [{"item": "Rice", "purchased": true}, {"item": "hi", "purchased": true}]}
testRecipe2 =  {"itemName": "Daves Fried Rize", "favorite": true, "comments": "This is how you make it", "ingredients": [{"item": "Rice", "purchased": true}, {"item": "hi", "purchased": true}]}

if(Meteor.isClient){
        listRecipes = function(){
            Meteor.call('listRecipes', function(err,res){
                console.log(err); 
                console.log(res);
                Session.set('recipes', res)
                return res
            })
        }; 
        
        createRecipe = function(recipeJSON){
            Meteor.call('createRecipe',recipeJSON , function(err,res){
                console.log(err); 
                console.log(res);
                Session.set('lastCreatedRecipe', res)
                return res
            })
        };
        updateRecipe = function(recipeId, recipeJSON){
            Meteor.call('updateRecipe',recipeId, recipeJSON , function(err,res){
                console.log(err); 
                console.log(res);
                Session.set('lastUpdatedRecipe', res)
                return res
            })
        };
        deleteRecipe = function(recipeId){
            Meteor.call('deleteRecipe', recipeId,  function(err,res){
                console.log(err); 
                console.log(res);
                Session.set('lastDeletedRecipe', res)
                return res
            })
        };
        getRecipe = function(recipeId){
            Meteor.call('getRecipe', recipeId,  function(err,res){
                console.log(err); 
                console.log(res);
                Session.set('currentRecipe', res)

            })
        };
    
    
}

if(Meteor.isServer){
    
    Meteor.methods({
        createRecipe: function(recipeJSON){
            returnId = recipes.insert(recipeJSON); 
            return returnId; 
        }, 
        updateRecipe: function(recipeId, recipeJSON){
            recipes.update({_id: recipeId}, recipeJSON)
        }, 
        deleteRecipe: function(recipeId){
            recipes.remove({_id: recipeId})
        }, 
        getRecipe: function(recipeId){
            returnRecipe = recipes.find({_id: recipeId}).fetch(); 
            return returnRecipe[0]; 
        }, 
        listRecipes: function(){
            returnJSON = recipes.find().fetch(); 
            return returnJSON; 
        }, 
        clearFavorites: function(){
            d = recipes.find().fetch()
            for(var x=0; x<d.length; x++ ){
                recipes.upsert({_id: d[x]['_id']}, {$set: {'favorite': false}})
            }
        }
        
    })
    
}