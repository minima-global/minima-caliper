# Hyperledger Caliper connector for Minima

## Get the code
```
git clone https://github.com/minima-global/minima-caliper.git
git checkout minima-caliper
```

# Initialize Caliper

Caliper requires node 10.24.1. To check your node version, and/or install node 10.24.1, use following commands"
```
# View localy installed versions
n ls

# View remotely available versions
n ls-remote -all

# Install v10.24.1
sudo n install 10.24.1

# Activate specific node version
n
```

Initialize Caliper
```
# Make sure you are using node 10.24.1

npm install
npm run repoclean -- --y
npm run bootstrap

# or, oneliner
npm install && npm run repoclean -- --y && npm run bootstrap
```

Run Caliper integration tests
```
BENCHMARK=minima ./.travis/benchmark-integration-test-direct.sh
```
