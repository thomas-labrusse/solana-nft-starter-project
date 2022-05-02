import React, { useEffect, useState } from 'react'
import { Connection } from '@solana/web3.js'
import './App.css'
import twitterLogo from './assets/twitter-logo.svg'

// Components
import CandyMachine from './CandyMachine'

//NOTE: TEST FOR METADATA
import { programs } from '@metaplex/js'

//NOTE: TEST FOR METADATA
const {
	metadata: { Metadata },
} = programs

// Constants
const TWITTER_HANDLE = '_buildspace'
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`

const App = () => {
	const [walletAddress, setWalletAddress] = useState(null)

	//NOTE: TEST CODE ----------
	const getAllNFT = async () => {
		const rpcHost = process.env.REACT_APP_SOLANA_RPC_URL
		console.log('RPC URL:', rpcHost)
		const connection = new Connection(rpcHost)
		console.log('connection:', connection)
		const ownerPublickey = process.env.REACT_APP_OWNER_PUBLIC_KEY
		const nftsmetadata = await Metadata.findDataByOwner(
			connection,
			ownerPublickey
		)
		console.log('Metadata:', nftsmetadata)
	}

	//NOTE: TEST CODE ----------

	const checkIfWalletIsConnected = async () => {
		try {
			const { solana } = window

			if (solana && solana.isPhantom) {
				console.log('Phantom wallet found!')
				const response = await solana.connect({ onlyIfTrusted: true })
				console.log('Connected with Public Key:', response.publicKey.toString())
				setWalletAddress(response.publicKey.toString())
			} else {
				alert('Solana object not found! Get a Phantom Wallet.')
			}
		} catch (error) {
			console.error(error)
		}
	}

	const connectWallet = async () => {
		const { solana } = window

		if (solana) {
			const response = await solana.connect()
			console.log('Solana connect response :', response)
			console.log('Connected with Public Key:', response.publicKey.toString())
			setWalletAddress(response.publicKey.toString())
		}
	}

	const renderNotConnectedContainer = () => (
		<button
			className='cta-button connect-wallet-button'
			onClick={connectWallet}
		>
			Connect to Wallet
		</button>
	)

	useEffect(() => {
		const onLoad = async () => {
			await checkIfWalletIsConnected()
		}
		//waiting for the window to be fully finish loading before checking for the "solana" object
		window.addEventListener('load', onLoad)
		return () => window.removeEventListener('load', onLoad)
	})

	return (
		<div className='App'>
			<div className='container'>
				<div className='header-container'>
					<div>
						<button onClick={getAllNFT}>get all nfts</button>
					</div>
					<p className='header'>🍭 Candy Drop</p>
					<p className='sub-text'>NFT drop machine with fair mint</p>
					{!walletAddress && renderNotConnectedContainer()}
				</div>
				{walletAddress && <CandyMachine walletAddress={window.solana} />}
				<div className='footer-container'>
					<img alt='Twitter Logo' className='twitter-logo' src={twitterLogo} />
					<a
						className='footer-text'
						href={TWITTER_LINK}
						target='_blank'
						rel='noreferrer'
					>{`built on @${TWITTER_HANDLE}`}</a>
				</div>
			</div>
		</div>
	)
}

export default App
