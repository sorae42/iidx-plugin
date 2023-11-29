# IIDX

Plugin Version: **v1.4.4_a4**

This is A Core IIDX Plugin.

## Before Upgrade
 - [!!] Your customize settings which were configurable in the Plugin Settings section will be reset.
 - You must play once after applying this update, otherwise profile customize setting page will not render.
 - Customize settings page is moved to Profiles -> (each profile) Detail -> Settings.

## Supported Versions
 - HEROIC VERSE
 - BISTROVER
 - CastHour
 - RESIDENT
 - EPOLIS

## Features
 - STEP UP
 - DAN COURSES (EISEI/KIWAMI)
 - RIVAL
 - EVENT (WORLD TOURISM)
 - ARENA (LOCAL)
 - RANDOM LANE TICKET
 - SONG SELECTION NOTES

## Changelog
  - Added Used Option Display support on Pacemaker.
  - Added Eisei/Kiwami Dan Courses support. (Experimental)
  - Added Arena support. (LOCAL only, Experimental, currently using hard-coded values)
  - Added Random Lane Gacha support. (Experimental)
    - Buying [Random Lane Ticket] won't do anything.
  - Added Song Selection Notes support. (Experimental)
  - Added Rival support. (Experimental)
    - Pacemaker : Only [RIVAL (NUM)] and [RIVAL TOP] works.
    - Setting Page : Must fill in-order otherwise it may cause unexpected behaviour.
      - Your saved settings will not reflect on Rivals Setting page.
  - Added Pacemaker Target Score support. (Experimental)
    - Supported Type : [ALL/VENUE/STORE/RIVAL/SAME-DAN TOP] only
  - Added BPL World Tourism Save support.
  - Added Event Save support.
  - Added Fixed Random Lane Ticket Setting on Customize Settings. (Added after randomly generated tickets)
    - These are generated with expire date set to today, [Order By Expire Date] will reveal these first.
    - Requirements : Pre-Calculated arrange_id values (0~5039 range)
      - Input Form Format : value1,value2,value3...
  - Added Phase Settings. [Plugin Settings]
  - Added STORE TOP SCORE Display support on Song Select. (Experimental)
    - Semi-migration, Only score data that played after this update will display.
  - Added Random Lane Ticket Favorite support.
    - Requirements : Must be in [0000000] (1~7 range) format.
      - Input Form Format : value1,value2,value3...
  - Updated Customize Lists. (This may cause unexpected behaviour on other versions)
  - Moved Customize settings to Profiles
    - Each profile can have its customized settings.
    - Must edit both [customlist.ts, profile_detail.pug] in order to update customize lists.
  - Fixed where Dan Class was unable to claim if you failed previously.
  - Fixed where DP Play Records were saved incorrectly if you played the same song with different difficulty.
  - Fixed where STEP UP data was unable to save since CastHour.
  - Fixed where Enabling IIDXID Hide option makes some options invalid.
  - Fixed where QPRO customize settings does not reflect on result screen.
  - Fixed where music.reg response was invalid.
  - Fixed where New Card was unable to register.
  - Updated Customize [Lane Cover] Lists (RESIDENT_1208)
  - Fixed where used options on Pacemaker were saved incorrectly.
    - This will wipe all used options on pacemaker data, only saved data after this update will display.
  - Enabled BPL Battle on RESIDENT. (LOCAL only, Experimental)
  - Added Experimental EPOLIS support. (most of webui are broken)
  - [EOL]
