module.exportrs.flagSelector(flagName) {

  function determineFlagBuilding(flagName) {

    if (flagName.pos.roomName.find(FIND_MY_CONSTRUCTION_SITES).length >= 100 {
      return;
      //this is here to try to exit this if building que is full or reached its limit. I think..
    }

    if (flagName == "Road") {
      return;
      }
    else if (flagName == "Container") {
      let buildContainer = flagName.pos.roomName.createConstructionSite(flagName.pos, STRUCTURE_CONTAINER);
      if (buildContainer == 0){
        return true;
        }
      else if (buildContainer != 0) {
        console.log(buildContiner)
        console.log("====Debugging ProtoFlags!====")
        }
      //above ready for debug
    }
    else if (flagName == "Extension"){
      let buildExtension = flagName.pos.roomName.createConstructionSite(flagName.pos, STRUCTURE_EXTENSION);
      if (buildExtension == 0){
        return true;
        }
      else if ( buildExtension != 0){
        console.log(buildExtension)
        console.log("====Debugging ProtoFlags!====")
        }
      //above ready for debug
    }
    else if (flagName == "ClaimRoom") {
      //here is where we change room memory to claim status? therefore initiating a claim creep to be created/added to que?
    }

  } // end of function call

  if (determineFlagBuilding(flagName)) {
    return;
  }
  else {
    console.log("did not return True?! Maybe this isnt needed...")
  }

};
