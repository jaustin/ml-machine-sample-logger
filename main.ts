input.onButtonPressed(Button.A, function () {
    ActivityCollection.log(ActivityCollection.createAction("clap"), 1000)
})
input.onButtonPressed(Button.AB, function () {
    ActivityCollection.markSuspect()
})
input.onButtonPressed(Button.B, function () {
    ActivityCollection.log(ActivityCollection.createAction("wave"), 100)
})
input.onLogoEvent(TouchButtonEvent.Pressed, function () {
    ActivityCollection.log(ActivityCollection.createAction("still"), 5000)
})
