function numberBetween(startNum: number, endNum: number): number {
    return Math.floor(Math.random() * endNum) + startNum;
}

export function ConversationStarter(room: Room) {

    var reactiontypes = [angryReaction, sadReaction, cuteReaction];
    var angryReaction = ["😡😡", "testAngry1", "testAngry2"];
    var sadReaction = ["testSad1", "testSad2", "testSad3"];
    var cuteReaction = ["cuteTest1", "cuteTest2", "cuteTest3"];
    var creep: Creep = room.creeps[numberBetween(0, room.creeps.length)]
    console.log(reactiontypes, "emotion[0]")
    var emotion = reactiontypes[numberBetween(0, reactiontypes.length)]
    console.log(emotion)
    var reaction = emotion[numberBetween(0, emotion.length)];
    creep.say(reaction)
}
export class CreepConversation {


}

export class CreepReplies {

}
