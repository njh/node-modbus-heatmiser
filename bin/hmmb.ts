#!/usr/bin/env node

import { Command, Option } from 'commander'
import pc from 'picocolors'
import { Client, Thermostat } from '../lib/index'
import { version } from '../lib/version'

function runClient (program: Command, callback: (thermostat: Thermostat) => Promise<any>): void {
  const options = program.opts()
  const client = new Client(options.device)
  const thermostat = client.addThermostat(options.id)

  client.connect()
    .then(async () => {
      return await callback(thermostat)
    })
    .then(() => {
      client.close()
    })
    .catch((err) => {
      console.error(err)
    })
}

const program = new Command()

program
  .version(version)
  .description('Tool for controlling Heatmiser Modbus Thermostats')
  .addOption(new Option('-d, --device <port>', 'The serial port device to connect to (eg /dev/ttyUSB0)').env('HMMB_DEVICE').makeOptionMandatory())
  .addOption(new Option('-i, --id <num>', 'The Communications ID of the device to control (1-32)').env('HMMB_ID').default(1))

program
  .command('get-status')
  .description('Display thermostat status (including current temperatures)')
  .action(() => {
    runClient(program, async (thermostat) => {
      let units = ''
      return await thermostat.getTemperatureUnits()
        .then(async (result) => {
          units = result
          return await thermostat.readStatus()
        })
        .then((status) => {
          const relayStatus = thermostat.relayStatus == null
            ? 'n/a'
            : thermostat.relayStatus ? 'on 🔥' : 'off'
          console.log(`      Relay Status: ${pc.bold(relayStatus)}`)
          console.log(`  Room Temperature: ${pc.bold(thermostat.roomTemperature)} °${units}`)
          console.log(` Floor Temperature: ${pc.bold(thermostat.floorTemperature)} °${units}`)
          console.log(`Target Temperature: ${pc.bold(thermostat.targetTemperature)} °${units}`)
          const onOffState = thermostat.onOffState == null
            ? 'n/a'
            : thermostat.onOffState ? 'on' : 'off'
          console.log(`      On/Off State: ${pc.bold(onOffState)}`)
          console.log(`    Operation Mode: ${pc.bold(thermostat.operationMode)}`)
        })
    })
  })

program
  .command('turn-on')
  .description('Turn on the thermostat')
  .action(() => {
    runClient(program, async (thermostat) => {
      console.log('Turning on: ' + thermostat.name)
      return await thermostat.turnOn()
    })
  })

program
  .command('turn-off')
  .description('Turn off the thermostat')
  .action(() => {
    runClient(program, async (thermostat) => {
      console.log('Turning off: ' + thermostat.name)
      return await thermostat.turnOff()
    })
  })

program
  .command('set-temperature')
  .argument('<temp>', 'the target temperature', parseFloat)
  .description('Set the target room temperature')
  .action((temp) => {
    runClient(program, async (thermostat) => {
      console.log('Setting target temperature to: ', temp)
      return await thermostat.setTargetTemperature(temp)
    })
  })

program
  .command('set-floor-limit')
  .argument('<temp>', 'the temperature limit', parseFloat)
  .description('Set the temperature limit for the floor sensor')
  .action((temp) => {
    runClient(program, async (thermostat) => {
      console.log('Setting floor limit temperature to: ', temp)
      return await thermostat.setFloorLimitTemperature(temp)
    })
  })

program
  .command('set-hold')
  .argument('<temp>', 'temperature for hold period')
  .argument('<hours:mins>', 'time of hold period')
  .description('Set a different temperature for a desired duration')
  .action((temp: number, duration: string) => {
    runClient(program, async (thermostat) => {
      let mins: number
      const matches = duration.match(/^(\d+):(\d+)$/)
      if (matches != null) {
        mins = (parseInt(matches[1]) * 60) + parseInt(matches[2])
      } else {
        mins = parseInt(duration)
      }
      console.log(`Setting temperature to ${temp} for ${mins} minutes`)
      return await thermostat.setHoldTemperature(temp, mins)
    })
  })

program
  .command('set-units')
  .argument('<units>', 'the temperature units (C or F)')
  .description('Set the temperature units used by the thermostat')
  .action((units) => {
    runClient(program, async (thermostat) => {
      const initial = units[0].toUpperCase()
      console.log('Setting temperature units to: ', initial)
      return await thermostat.setTemperatureUnits(initial)
    })
  })

program
  .command('set-time')
  .description('Sync the system clock to the thermostat')
  .action(() => {
    runClient(program, async (thermostat) => {
      const now = new Date()
      console.log('Setting time to: ', now)
      return await thermostat.setTime(now)
    })
  })

program
  .command('set-keylock')
  .argument('<pin>', 'a 4-digit pin', parseInt)
  .description('Set a PIN to lock the keypad with')
  .action((pin) => {
    runClient(program, async (thermostat) => {
      if (isNaN(pin)) {
        pin = null
      }
      console.log('Setting keylock pin to: ', pin)
      return await thermostat.setKeylock(pin)
    })
  })

program
  .command('factory-reset')
  .description('Restore thermostat to the default factory settings')
  .action(() => {
    runClient(program, async (thermostat) => {
      console.log('Performing factory reset')
      console.log('NOTE: Modbus support will be disabled after reset')
      return await thermostat.factoryReset()
    })
  })

program.parse()
