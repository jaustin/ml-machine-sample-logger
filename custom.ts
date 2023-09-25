/**
 * Log data to flash storage
 */
//% block="Activty Logger"
//% icon="\uf2a7"
//% color="#378273"
namespace ActivityCollection {
    export enum DeleteType {
        //% block="fast"
        Fast,
        //% block="full"
        Full
    }
    let imagesAnimation = [images.createImage(`
    . . . . .
    . . . . .
    . . # . .
    . . . . .
    . . . . .
    `), images.iconImage(IconNames.SmallSquare), images.iconImage(IconNames.Square)]
    let onLogFullHandler: () => void;
    let _disabled = false;

    let initialized = false;
    function init() {
        if (initialized)
            return;
        initialized = true;
        logCSVData([
            createCV("a",""),
            createCV("x", ""),
            createCV("y", ""),
            createCV("z", "")
        ]
        )
        flashlog.setTimeStamp(FlashLogTimeStampFormat.None)
        control.onEvent(DAL.MICROBIT_ID_LOG, DAL.MICROBIT_LOG_EVT_LOG_FULL, () => {
            _disabled = true;
            if (onLogFullHandler) {
                onLogFullHandler();
            } else {
                basic.showLeds(`
                    # . . . #
                    # # . # #
                    . . . . .
                    . # # # .
                    # . . . #
                `);
                basic.pause(1000);
                basic.clearScreen();
                basic.showString("928");
            }
        });
    }
    export class ColumnValue {
        public value: string;
        constructor(
            public column: string,
            value: any
        ) {
            this.value = "" + value;
        }
    }

    function createCV(column: string, value: any): ColumnValue {
        return new ColumnValue(column, value);
    }

    function _columnField(column: string) {
        return column
    }

    export function logCSVData(data: ColumnValue[]): void {
        if (!data || !data.length)
            return;
        init();

        if (_disabled)
            return;

        flashlog.beginRow();
        for (const cv of data) {
            flashlog.logData(cv.column, cv.value);
        }
        flashlog.endRow();
    }

    export class MLAction {
        constructor(
            public action: string,
        ) {
        }
    }
    /**
     * An activity name for an ML class
     * @param activity the name of the activity to set
     * @returns A new activity that can trigger a collection session
     */
    //% block="action $action"
    //% action.shadow=datalogger_actionfield
    //% blockId=dataloggercreatemlclass
    //% blockHidden=true
    //% group="micro:bit (V2)"
    //% weight=80 help=datalogger/create-cv
    export function createAction(action: string): MLAction {
        return new MLAction(action);
    }

    //% block="$action"
    //% blockId=datalogger_actionfield
    //% group="micro:bit (V2)"
    //% blockHidden=true shim=TD_ID
    //% action.fieldEditor="autocomplete" action.fieldOptions.decompileLiterals=true
    //% action.fieldOptions.key="dataloggeraction"
    export function _actionField(action: string) {
        return action
    }


    /**
     * Record an action from the accelerometer
     * @param data1 the name of the action
     * @param countdown the time in milliseconds before the recording starts
     */
    //% block="record $data1|| with countdown $countdown ms"
    //% blockId=activityloggerlog
    //% countdown.shadow=timePicker
    //% countdown.defl=1000
    //% data1.shadow=dataloggercreatemlclass
    //% inlineInputMode="variable"
    //% expandableArgumentMode="toggle"
    //% group="micro:bit (V2)"
    //% weight=100 help=datalogger/log
    export function log(
        data1: ActivityCollection.MLAction,
        countdown: number = 0
    ): void {
        visualCountdown(countdown)
        startActivity(data1.action, 80)
    }

    /**
     * Set the columns for future data logging
     * @param col1 Title for first column to be added
     * @param col2 Title for second column to be added
     * @param col3 Title for third column to be added
     * @param col4 Title for fourth column to be added
     * @param col5 Title for fifth column to be added
     * @param col6 Title for sixth column to be added
     * @param col7 Title for seventh column to be added
     * @param col8 Title for eighth column to be added
     * @param col9 Title for ninth column to be added
     * @param col10 Title for tenth column to be added
     */
    //% block="set actions $col1||$col2 $col3 $col4 $col5 $col6 $col7 $col8 $col9 $col10"
    //% blockId=dataloggersetactions
    //% inlineInputMode="variable"
    //% inlineInputModeLimit=1
    //% group="micro:bit (V2)"
    //% weight=70
    //% col1.shadow=datalogger_actionfield
    //% col2.shadow=datalogger_actionfield
    //% col3.shadow=datalogger_actionfield
    //% col4.shadow=datalogger_actionfield
    //% col5.shadow=datalogger_actionfield
    //% col6.shadow=datalogger_actionfield
    //% col7.shadow=datalogger_actionfield
    //% col8.shadow=datalogger_actionfield
    //% col9.shadow=datalogger_actionfield
    //% col10.shadow=datalogger_actionfield
    export function setColumnTitles(
        col1: string,
        col2?: string,
        col3?: string,
        col4?: string,
        col5?: string,
        col6?: string,
        col7?: string,
        col8?: string,
        col9?: string,
        col10?: string
    ): void {

    }
    /**
    **/
    //% block="mark last recording for checking"
    //% blockId=marksuspect
    //% group="micro:bit (V2)"
    //% weight=60
    export function markSuspect(): void {
        init()
        logCSVData([createCV("a", "suspect^")])

    }
    /**
     * Delete all existing logs, including column headers. By default this only marks the log as
     * overwriteable / deletable in the future.
     * @param deleteType optional set whether a deletion will be fast or full
     */
    //% block="clear samples||$deleteType"
    //% blockId=dataloggerdeletelog
    //% group="micro:bit (V2)"
    //% weight=60 help=datalogger/delete-log
    export function deleteLog(deleteType?: DeleteType): void {
        init();
        flashlog.clear(deleteType === DeleteType.Full);
        _disabled = false;
    }

    /**
     * Register an event to run when no more data can be logged.
     * @param handler code to run when the log is full and no more data can be stored.
     */
    //% block="on log full"
    //% blockId="on log full"
    //% group="micro:bit (V2)"
    //% weight=40 help=datalogger/on-log-full
    export function onLogFull(handler: () => void): void {
        init();
        onLogFullHandler = handler;
    }
    function visualCountdown(time:number): void {
        if (time <= 0) {
            return
        }
        let extratime = 0
        let beepdelta = 100
        let start_freq = 1500
        let end_freq = 262
        let freq_delta = (end_freq - start_freq) / 255
        let section_length = extratime / 255
        if (time > 500) {
            music.setTempo(120)
            extratime = time - (beepdelta*3)
            section_length = extratime / 255
            music.ringTone(start_freq)
            for (let index = 0; index <= 255; index++) {
                led.plotBarGraph(
                    255 - index,
                    255)
                music.ringTone(start_freq + index * (freq_delta))
                basic.pause(section_length)
            }
        } else {
            extratime = 50
            music.play(music.createSoundExpression(WaveShape.Sine, start_freq, end_freq, 255, 255, extratime, SoundExpressionEffect.None, InterpolationCurve.Linear),music.PlaybackMode.UntilDone)
            music.setTempo(500)
            beepdelta = time / 3
        }

        basic.clearScreen()
        for (let index = 0; index <= 2; index++) {
            music.play(music.tonePlayable(262, music.beat(BeatFraction.Half)), music.PlaybackMode.InBackground)
            imagesAnimation[index].showImage(0)
            basic.pause(beepdelta)
        }
        music.play(music.tonePlayable(523, music.beat(BeatFraction.Double)), music.PlaybackMode.InBackground)
    }
    function startActivity(activityName: string, totalSamples: number) {
        let buffer_a = pins.createBuffer(totalSamples * 2)
        let buffer_x = pins.createBuffer(totalSamples * 2)
        let buffer_y = pins.createBuffer(totalSamples * 2)
        let buffer_z = pins.createBuffer(totalSamples * 2)
        let current_samples = 0
        let logging = false
        let recording_period_milliseconds = 20
        buffer_a.fill(0);
        buffer_x.fill(0);
        buffer_y.fill(0);
        buffer_z.fill(0);
        logCSVData([createCV("a", activityName)])
        logging = true
        let t_current_ms
        let next_iteration_microsec = input.runningTimeMicros()
        let t_previous_ms = next_iteration_microsec / 1000
        basic.showLeds(`
        # # # # #
        # # # # #
        # # # # #
        # # # # #
        # # # # #
        `,0)
        while (logging) {
            while (next_iteration_microsec > input.runningTimeMicros()) {

            }
            t_current_ms = input.runningTime()
            buffer_a.setNumber(NumberFormat.Int16LE, current_samples * 2, t_current_ms - t_previous_ms)
            buffer_x.setNumber(NumberFormat.Int16LE, current_samples * 2, input.acceleration(Dimension.X))
            buffer_y.setNumber(NumberFormat.Int16LE, current_samples * 2, input.acceleration(Dimension.Y))
            buffer_z.setNumber(NumberFormat.Int16LE, current_samples * 2, input.acceleration(Dimension.Z))
            next_iteration_microsec = 1000 * (t_current_ms + recording_period_milliseconds)
            t_previous_ms = t_current_ms
            current_samples += 1
            if (current_samples >= totalSamples) {
                basic.clearScreen()
                music.play(music.builtinPlayableSoundEffect(music.createSoundExpression(WaveShape.Sine, 5000, 0, 255, 0, 300, SoundExpressionEffect.None, InterpolationCurve.Linear)), music.PlaybackMode.InBackground)
                for (let index2 = 0; index2 <= totalSamples - 1; index2++) {
                    logCSVData([
                        createCV("a", buffer_a.getNumber(NumberFormat.Int16LE, index2 * 2)),
                        createCV("x", buffer_x.getNumber(NumberFormat.Int16LE, index2 * 2)),
                        createCV("y", buffer_y.getNumber(NumberFormat.Int16LE, index2 * 2)),
                        createCV("z", buffer_z.getNumber(NumberFormat.Int16LE, index2 * 2))
                    ]
                    )
                }
                logging = false
            }
            basic.pause(10)
        }

    }

}