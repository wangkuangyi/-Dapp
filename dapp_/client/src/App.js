import React, { Component } from "react";
import SimpleStorageContract from "./contracts/SimpleStorage.json";
import Myheyue from "./contracts/paimai.json";
import getWeb3 from "./getWeb3";
import 'antd/dist/antd.css';
import { Input,Button,Menu, Radio} from 'antd';
import { Table, Tag, Space } from 'antd';
import { Layout } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import Item from "mock-fs/lib/item";
import "./App.css";
import sha256 from 'crypto-js/sha256';
const { Header, Content } = Layout;



class App extends Component {

  constructor()
  {
    super()
    this.state={
      //账户
      nowbalance:0,
      nowaccount:0,
      //nft
      nftnumber:0,
      nft_string:0,
      ispaimai:0,
      //拍卖
      //end_time:0,
      giver_address:0,
      price_down:0,
      price_highest:0,
      highest_bidder:0,
      goal_nft:0,
      //其他
      storageValue: 0,
      web3: null, 
      instance:null,
      accounts:null, 
      contract:null
    }
  }

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const balance0 = await web3.eth.getBalance(accounts[0]);
      const balance1 = await web3.utils.fromWei(balance0, 'ether')
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = SimpleStorageContract.networks[networkId];
      const instance = new web3.eth.Contract(
        SimpleStorageContract.abi,
        deployedNetwork && deployedNetwork.address,
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance ,instance:instance, nowaccount:accounts[0], nowbalance:balance1}, this.runExample);

      //得到nft
      const nftforme = await instance.methods.show_nft().call();
      this.setState({
        nftnumber:nftforme
      })

      //得到拍卖信息
      const goalnft = await instance.methods.show_paimai_nft().call();
      const giveraddress = await instance.methods.show_paimai_giveraddress().call();
      const moneydown = web3.utils.fromWei(await instance.methods.show_paimai_moneydown().call(),'ether');
      const moneyhigh = web3.utils.fromWei(await instance.methods.show_paimai_moneyhigh().call(),'ether');
      const bidderaddress = await instance.methods.show_paimai_bidderaddress().call();
      this.setState({
        giver_address:giveraddress,
        price_down:moneydown,
        price_highest:moneyhigh,
        highest_bidder:bidderaddress,
        goal_nft:goalnft,
      })

    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details. \nOr can't find your NFT`,
      );
      console.error(error);
    }
  };

  async donft(){
    const {instance,contract,web3}=this.state;
    const account = await web3.eth.getAccounts();
    if(!this.state.nftnumber){
      const nftdone = await instance.methods.do_nft(this.state.nft_string).call();
      this.setState({
        nftnumber:this.state.nft_string
      })
      console.log(this.state.nft_string);
    }
    else{
      alert("您已有NFT被铸造");
    }
  }

  get_nftstring(e){
    this.setState({
      nft_string:sha256(e.target.value).toString()
    });
  }

  get_moneydown(e){
    this.setState({
      price_down:e.target.value
    });
  }

  get_moneyhigh(e){
    this.setState({
      price_highest:e.target.value
    });
  }
  get_giveraddress(e){
    this.setState({
      giver_address:e.target.value
    });
  }
  get_bidder(e){
    this.setState({
      highest_bidder:e.target.value
    });
  }
  get_goalnft(e){
    this.setState({
      goal_nft:e.target.value
    });
  }

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <Layout>
      <Header>
        <Menu theme="light" mode="horizontal" defaultSelectedKeys={['2']}>
          <Menu.Item key="1">NFT拍卖</Menu.Item>
          <Menu.Item key="3" disabled="true" color="black">当前账户:{this.state.nowaccount}</Menu.Item>
          <Menu.Item key="4" disabled="true" color="black">余额:{this.state.nowbalance}ETH</Menu.Item>
        </Menu>
      </Header>
      <Content style={{height:800}}>
      <h1 style={{textAlign:"center",fontSize:36}}>Welcome!<br/>Time</h1>
      <h1 style={{textAlign:"center"}}>您的铸造</h1>
      <h1 style={{textAlign:"center"}}>{this.state.nft_string}</h1>
      <br/><br/><br/><br/>
      <h1 style={{textAlign:"center"}}>进行铸造<br/>
      <Input placeholder = "请输入需要铸造的字符串" style={{width:200,color:'black'}}  onChange={(e)=>this.get_nftstring(e)} />
      <Button type="primary" icon={<DownloadOutlined />} onClick={() => this.donft()}>铸造</Button>
      </h1>
      <br/><br/><br/><br/>
      <h1 style={{textAlign:"center"}}>正在进行拍卖</h1>
      <h1 style={{textAlign:"center"}}>NFT:{this.state.goal_nft},低价:{this.state.price_down},发起者:{this.state.giver_address},最高价:{this.state.price_highest},最高价出价者:{this.state.highest_bidder}</h1>
      <br/><br/><br/><br/>
      <h1 style={{textAlign:"center"}}>发起拍卖<br/>
      <Input placeholder = "请输入NFT数据" style={{width:200,color:'black'}} value={this.state.goalnft} onChange={(e)=>this.get_goalnft(e)} />
      <Button type="primary" icon={<DownloadOutlined />}>输入</Button>
      <Input placeholder = "请输入您的地址" style={{width:200,color:'black'}} value={this.state.giver_address} onChange={(e)=>this.get_giveraddress(e)} />
      <Button type="primary" icon={<DownloadOutlined />}>输入</Button>
      <Input placeholder = "请输入低价" style={{width:200,color:'black'}} value={this.state.price_down} onChange={(e)=>this.get_moneydown(e)} />
      <Button type="primary" icon={<DownloadOutlined />}>NFT</Button>
      </h1>
      </Content>
      </Layout>  
    );
  }
}


export default App;
