import { ethers } from './ethers-5.6.esm.min.js';

connectButton.onclick = connect;
mintBtn.onclick = mint;

async function connect() {
  if (typeof window.ethereum !== 'undefined') {
    try {
      await ethereum.request({ method: 'eth_requestAccounts' });
    } catch (error) {
      console.log(error);
    }
    const accounts = await ethereum.request({ method: 'eth_accounts' });
    console.log(accounts);
    connectButton.innerHTML = accounts[0];
  } else {
    connectButton.innerHTML = 'Please install MetaMask';
  }
}

async function mint() {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = await provider.getSigner();
  const wa = await signer.getAddress();

  const rpcUrl = 'https://ethereum-sepolia.publicnode.com';
  const gnft = '0xE3FB3a743d2481a13D590e2443614435a263D5f0';
  const relayer = '0x6631f9d871a35D8e7206f62Dc493bf770Fcf2F1b';

  const forwarder = new ethers.Contract(
    relayer,
    abi,
    new ethers.providers.JsonRpcProvider(rpcUrl),
  );

  const nonce = await forwarder.getNonce(wa);

  // const abiCoder = new ethers.utils.AbiCoder();

  // let data = abiCoder.encode(['uint256'], [1]);
  // data = data.slice(2, data.length);

  const Req = {
    from: wa,
    to: gnft,
    value: 0,
    gas: 1000000,
    nonce: nonce.toNumber(),
    data: '0x1249c58b',
  };

  let message = ethers.utils.solidityKeccak256(
    ['address', 'address', 'uint256', 'uint256', 'uint256', 'bytes'],
    [Req.from, Req.to, Req.value, Req.gas, Req.nonce, Req.data],
  );

  const arrayifyMessage = await ethers.utils.arrayify(message);
  const flatSignature = await signer.signMessage(arrayifyMessage);
  try {
    const execute = await fetch('http://localhost:3000/txns', {
      method: 'POST',
      body: JSON.stringify({
        txn: Req,
        signature: flatSignature,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (execute.ok) {
      const resp = await execute.json();
      console.log(resp);
    } else {
      alert('Tx failed with error: ' + execute.statusText);
    }
  } catch (error) {
    console.error(error);
  }
}

const abi = [
  {
    inputs: [],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    inputs: [],
    name: '_TYPEHASH',
    outputs: [
      {
        internalType: 'bytes32',
        name: '',
        type: 'bytes32',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: 'address',
            name: 'from',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'to',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: 'value',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'gas',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'nonce',
            type: 'uint256',
          },
          {
            internalType: 'bytes',
            name: 'data',
            type: 'bytes',
          },
        ],
        internalType: 'struct MinimalForwarder.ForwardRequest',
        name: 'req',
        type: 'tuple',
      },
      {
        internalType: 'bytes',
        name: 'signature',
        type: 'bytes',
      },
    ],
    name: 'execute',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
      {
        internalType: 'bytes',
        name: '',
        type: 'bytes',
      },
    ],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'from',
        type: 'address',
      },
    ],
    name: 'getNonce',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'from',
        type: 'address',
      },
      {
        internalType: 'bytes',
        name: '_signature',
        type: 'bytes',
      },
    ],
    name: 'isMessageValid',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: 'address',
            name: 'from',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'to',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: 'value',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'gas',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'nonce',
            type: 'uint256',
          },
          {
            internalType: 'bytes',
            name: 'data',
            type: 'bytes',
          },
        ],
        internalType: 'struct MinimalForwarder.ForwardRequest',
        name: 'req',
        type: 'tuple',
      },
      {
        internalType: 'bytes',
        name: 'signature',
        type: 'bytes',
      },
    ],
    name: 'verify',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    stateMutability: 'payable',
    type: 'receive',
  },
];
