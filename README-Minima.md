# Hyperledger Caliper connector for Minima

## Get the code
```
cd WORK_DIR
git clone https://github.com/minima-global/minima-caliper.git
cd minima-caliper
git checkout minima-caliper
```

## Prepare Minima.js
When cloned, minima-caliper and minima.js should be in a same folder
```
cd WORK_DIR
git clone https://github.com/minima-global/minima.js.git
cd minima.js
npm install
npm run build
npm pack
```
Expected package file name is minima-0.96.20.tgz. Make sure this is the correct name, or set the new name in
```
minima-caliper/packages/caliper-cli/lib/lib/config.yaml
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
Results will be similar to this
```
+----------+------+------+-----------------+-----------------+-----------------+-----------------+------------------+
| Name     | Succ | Fail | Send Rate (TPS) | Max Latency (s) | Min Latency (s) | Avg Latency (s) | Throughput (TPS) |
|----------|------|------|-----------------|-----------------|-----------------|-----------------|------------------|
| topblock | 2000 | 0    | 500.9           | 0.03            | 0.00            | 0.00            | 500.8            |
|----------|------|------|-----------------|-----------------|-----------------|-----------------|------------------|
| gimme50  | 8    | 0    | Infinity        | 0.01            | 0.00            | 0.00            | 1600.0           |
+----------+------+------+-----------------+-----------------+-----------------+-----------------+------------------+
```
