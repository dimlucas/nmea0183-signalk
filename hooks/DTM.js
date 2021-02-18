/*
* DTM codec
*
* Copyright 2021, Dimitris Loukas
*
* Licensed under the Apache License, Version 2.0 (the "License")
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*     http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*
*/

"use strict"

/*
=== ZDA - Time & Date ===

------------------------------------------------------------------------------
*******1         2  3  4    5  6  7
*******|         |  |  |    |  |  |
$--ZDA,hhmmss.ss,xx,xx,xxxx,xx,xx*hh<CR><LF>
------------------------------------------------------------------------------

Field Number:
1. UTC time (hours, minutes, seconds, may have fractional subsecond)
2. Day, 01 to 31
3. Month, 01 to 12
4. Year (4 digits)
5. Local zone description, 00 to +- 13 hours
6. Local zone minutes description, apply same sign as local hours
7. Checksum
Example: $GPZDA,183300,31,12,2018,-02,00*64
*/
const debug = require('debug')('signalk-parser-nmea0183/ZDA')
const utils = require('@signalk/nmea0183-utilities')
const moment = require('moment-timezone')

function isEmpty(mixed) {
    return ((typeof mixed !== 'string' && typeof mixed !== 'number') || (typeof mixed === 'string' && mixed.trim() === ''))
}

module.exports = function (input) {
    const { id, sentence, parts, tags } = input

    let localDatumCode = parts[1];
    let localDatumSubcode = parts[2];
    let latitudeOffset = parts[3];
    let ns = parts[4];
    let longitudeOffset = parts[5];
    let ew = parts[6];
    let altitudeOffset = parts[7];
    let datumName = parts[8];


    var delta = {}
    
    delta = {
        updates: [
            {
                source: tags.source,
                timestamp: tags.timestamp,
                values: [
                    {
                        path: "dtm",
                        value: {
                            localDatumCode,
                            localDatumSubcode,
                            ns,
                            latitudeOffset,
                            longitudeOffset,
                            ew,
                            altitudeOffset,
                            datumName
                        }
                    }
                ]
            }
        ]
    }

    return delta;
}
