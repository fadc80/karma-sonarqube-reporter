# Run it tests wiht jasmine and mocha

declare -A descriptions
declare -A folders

descriptions["jasmine"]="Project Angular/Jasmine"
descriptions["mocha"]="Project Angular/Mocha"

folders["jasmine"]="it/angular-jasmine"
folders["mocha"]="it/angular-mocha"

echo ${descriptions[$1]}
cd ${folders[$1]}

npm install
npm link ../../
npm run test
sonar-scanner