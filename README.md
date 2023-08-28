node-modbus-heatmiser
=====================

node.js library for controlling Heatmiser Modbus Thermostats

Wiring
------

To connect a Heatmiser Modbus Thermostat to a computer, you need a RS-485 adaptor.

<img src="docs/usb-to-heatmiser-edge.png" alt="Heatmiser Edge Connected to USB using RS-485 wiring" height="480" />

I initially had some trouble with connecting using a short (1m) cable during testing, until I discovered that the termination resistor in the Heatmiser Edge had to be switched *off* for short distances.


Command Line Tool
-----------------

```
Usage: hmmb [options] [command]

Tool for controlling Heatmiser Modbus Thermostats

Options:
  -V, --version                      output the version number
  -d, --device <port>                The serial port device to connect to (eg /dev/ttyUSB0) (env: HMMB_DEVICE)
  -i, --id <num>                     The Communications ID of the device to control (1-32) (default: 1, env: HMMB_ID)
  -h, --help                         display help for command

Commands:
  get-status                         Display thermostat status (including current temperatures)
  turn-on                            Turn on the thermostat
  turn-off                           Turn off the thermostat
  hold <temp> <hours:mins>           Set a different temperature for a desired duration
  set-temperature <temp>             Set the target room temperature
  set-floor-limit <temp>             Set the temperature limit for the floor sensor
  set-frost-temperature <temp>       Set the frost protection temperature (7-17 °C)
  set-switching-differential <temp>  Set the thermostat switching differential (in °C)
  set-output-delay <minutes>         Set time in minutes to delay output switching by
  set-up-down-limit <limit>          Set a limit on the use of the up and down keys
  set-sensors <mode>                 Set the sensor selection mode. See extended help for values.
  set-programme-periods <periods>    Set the number of programme periods
  set-programme-mode <mode>          Set the type of programme / schedule mode. See extended help for details.
  set-units <units>                  Set the temperature units used by the thermostat
  set-time                           Sync the system clock to the thermostat
  set-auto-dst <on or off>           Enable or disable automatic adjustment for Daylight Saving Time
  set-keylock <pin>                  Set a PIN to lock the keypad with
  factory-reset                      Restore thermostat to the default factory settings
  help [command]                     display help for command
```
License
-------

`node-modbus-heatmiser` is licensed under the terms of the MIT license.
See the file [LICENSE](/LICENSE.md) for details.

This software is independently written and maintained and is not supported by Heatmiser UK Limited.


Contact
-------

* Author:    Nicholas J Humfrey
* Twitter:   [@njh](http://twitter.com/njh)
