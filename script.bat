@echo off

if "%~1"=="save" (
  set date = date /t
  set time = time /t
  git add .
  git commit -m "bot: auto saving progress. date- %date%, time-%time%"
)


if "%~1"=="push" (
  set date = date /t
  set time = time /t
  git add .
  git commit -m "bot: auto saving progress. date- %date%, time-%time%"
  git push --all https://github.com/theboyofdream/gallery.git
)


if "%~1"=="restore" (
  git pull
  yarn install
)



:: Cleans the android gradle
::
:: script clean

if "%~1"=="clean" (
  cd "android"
  gradlew clean
  cd "../"
)


:: Builds the release version of android app (.apk file)
::
:: script build [-c] [-i]
::
:: -c cleans the android gradle
:: -i install the apk in connected devices

if "%~1"=="build" (
  cd "android"

  for %%a in (%*) do (
    if "%%a"=="-c" (
      gradlew clean
    )
  )

  :: "Build release apk"
  gradlew assembleRelease
  cd "../"

  copy "android/app/build/outputs/apk/release\app-release.apk" "app-release.apk"
  del "gallery.apk"
  rename "app-release.apk" "gallery.apk"

  for %%a in (%*) do (
    if "%%a"=="-i" (
      adb install "gallery.apk"
    )
  )
)
