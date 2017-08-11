# What is does

https://docs.google.com/document/d/1jysRxeA7q1ehmee-UD_XJNX87ssZiqpx_eKsNeR1Fgc/edit

# How to run (only dev end supported)
 * Create virtual env (for example, using virtualenvwrapper), OS X, ```mkvirtualenv --python=`which python3`  p3```. ```workon p3```.
 *  ```pip install -r requirements.txt```
 * ```manage.py migrate```
 * ```manage.py runserver```

# How to use
 * Press "Authorize" button, to allow your google user to write to GoogleFusion Tables.
 * Click on map, if it is real address, marker will be displayed along with address under the map.
 * "Reset" button deletes all data from app.db as well as from Google Fusion table.
 * "Look at Google Fusion table" will open Google Fusion table, so you can see updates there.
 * Additional information are logged in JS console.


# Design and architecture
 * Address counted valid if it is `street_address` `type`, uniquness is provided by comparing `formatted_address` fields (lat, lng, place_id can be different for same address).
 * It is in genral REST on back-end and front-end, partially implemented (not all methods)
 * Google Fusion table is owned by application, so is created beforehand (not dynamically)

 ## Notes
  * We send request to back-end every time address is valid.
  * Nobody can edit google data w/o authorization, that is why authorization is required.
  * Auth is not invoked silently, to avoid pop up blocking, so user needs to click "Authorize" button first.
  * Tested in Chrome

 ## Areas for improvement
   * Geodjango can be used to store Points(lat, lon), but for dev env one need to install spatialite,
     which is not within requirement to work out of the box (not installed by pip)
   * Tests
   * Validation of address lengh. In theory, addresses might be longer than 255 chars. Longer fields can be database specific and stripping to 255 is not always desirable.
   * For future extensions better use front-end library (like Backbone, etc) for restful communication with back-end
   * Log access by multiple users (still they can clean all data for other users)
   * Google fusion table can be created dynamically from start if there will be reason for this.

 ## Difference from original task (https://docs.google.com/document/d/1jysRxeA7q1ehmee-UD_XJNX87ssZiqpx_eKsNeR1Fgc/edit)
   * It was said: "Have a marker appear instantly after the click on the map based on the google fusion table data." He I place marker based on the internal app database data. Why: less requests to google api, faster checking for duplicates. It is basically not needed by desing, because we do not store duplicates in app DB. So I'd like to disagree to check duplicates in google fusion table, because it is additional request from backend, and on back-end it is faster to check. Sure can be changed if some requirements change.
