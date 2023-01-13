import { LEDColours, LEDColoursType } from './types/mappings';

export const mappings = {
  Puck: {
    NFC: {
      setUrl: (url: string) => `NRF.nfcURL(${url})`,
      reset: () => 'NRF.nfcURL()',
    },
    mag: {
      enableMag: () => `Puck.magOn()`,
      enableField: () => `require("puckjsv2-mag-level").on()`,
      disableMag: () => `Puck.magOff()`,
      disableField: () => `require("puckjsv2-mag-level").off()`,
      onMag: '',
      onField: '',
    },
    accel: {
      enableAccelMovement: () => `require("puckjsv2-accel-movement").on()`,
      enableAccelBigMovement: () =>
        `require("puckjsv2-accel-bigmovement").on()`,
      enableAccelTilt: () => `require("puckjsv2-accel-tilt").on()`,
      disableAccelMovement: () => `require("puckjsv2-accel-movement").off()`,
      disableAccelBigMovement: () =>
        `require("puckjsv2-accel-bigmovement").off()`,
      disableAccelTilt: () => `require("puckjsv2-accel-tilt").off()`,
      val: () => 'Puck.accel()',
      onMove: '',
      onTilt: '',
    },
    IR: {
      transmit: (data: number[]) => `Puck.IR([${data.join(',')}])`,
    },
    LED: {
      on: (color: LEDColoursType | LEDColoursType[]) =>
        Array.isArray(color)
          ? `digitalWrite(${color},1)`
          : `LED${LEDColours.indexOf(color) + 1}.set()`,
      off: (color: LEDColoursType | LEDColoursType[]) =>
        Array.isArray(color)
          ? `digitalWrite(${color},0)`
          : `LED${LEDColours.indexOf(color) + 1}.reset()`,
      toggle: (color: LEDColoursType) =>
        `LED${LEDColours.indexOf(color) + 1}.toggle()`,
      flash: (color: LEDColoursType, ms: number) =>
        `digitalPulse(LED${LEDColours.indexOf(color) + 1},1,${ms})`,
      val: (color: LEDColoursType) =>
        `digitalRead(LED${LEDColours.indexOf(color) + 1}) == 1`,
    },
    onPress: (func: any) => {
      return `setWatch(function(){
            ${func}
        }, BTN, {edge:"rising", repeat:true, debounce:50})`;
    },
    onTimedPress: '',
    getTemperature: 'E.getTemperature()',
    getLightVal: 'Puck.light()',
  },
  DeviceController: {
    connect: () => `0`,
    reset: () => `reset(true)`,
    dump: () => `E.dumpStr()`,
    getDeviceType: () => `process.env.BOARD`,
    getBattery: () => `E.getBattery()`,
    Call: {},
    Pin: {
      val: (pin: string) => `${pin}.read()`,
      analogOn: (pin: string, val: number) => `analogWrite(${pin},${val})`,
      digitalOn: (pin: string, val: 0 | 1) => `digitalWrite(${pin},${val})`,
      digitalToggle: (pin: string) => `${pin}.toggle()`,
      reset: (pin: string) => `${pin}.reset()`,
      getInfo: (pin: string) => `${pin}.getInfo()`,
    },
  },
  Pixl: {},
  Bangle: {},
};
