import { Alchemy, Network } from 'alchemy-sdk';
import { useEffect, useState } from 'react';
import Block from './Block';
import './App.css';
import { formatObject, fromStorage, range } from './utils';
import Container from 'react-bootstrap/esm/Container';

// Refer to the README doc for more information about using API
// keys in client-side code. You should never do this in production
// level code.
const settings = {
  apiKey: process.env.REACT_APP_ALCHEMY_API_KEY,
  network: Network.ETH_MAINNET,
  batchRequests: true,
};


// In this week's lessons we used ethers.js. Here we are using the
// Alchemy SDK is an umbrella library with several different packages.
//
// You can read more about the packages here:
//   https://docs.alchemy.com/reference/alchemy-sdk-api-surface-overview#api-surface
const alchemy = new Alchemy(settings);
// How to make alchemy batch requests?
function App() {
  const [currentBlockNumber, setCurrentBlockNumber] = useState();
  const [latestsBlocks, setLatestsBlocks] = useState("[]");

  useEffect(() => {
    async function getBlockNumber() {
      setCurrentBlockNumber(await alchemy.core.getBlockNumber());
    }
    async function getBlock(blockNumber) {
      return formatObject(await alchemy.core.getBlockWithTransactions(blockNumber));
    }
    async function getLatestsBlocks() {
      if (!currentBlockNumber) return;
      const blocks = await Promise.all(range(currentBlockNumber - 2, currentBlockNumber).map(getBlock));
      console.log("getLatestsBlocks ~ blocks", blocks);
      setLatestsBlocks(JSON.stringify(blocks));
    }
    getBlockNumber();
    getLatestsBlocks()
  });
  return <div>
    <h1 className='header'>Block Explorer</h1>
    <Container className='p-auto m-auto'>
      <h3>Latest blocks</h3>
      {fromStorage(latestsBlocks).map(block => <Block key={block.hash} block={block} />)}
    </Container>
  </div>
}

export default App;
