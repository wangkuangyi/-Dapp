// SPDX-License-Identifier: MIT
pragma solidity >=0.4.21 <0.7.0;
pragma experimental ABIEncoderV2;

contract SimpleStorage {
  uint storedData;

  function set(uint x) public {
    storedData = x;
  }

  function get() public view returns (uint) {
    return storedData;
  }

  //paimai
    uint auctionendtime;
    address giver_address;
    uint goal_NFT;
    uint money_down;
    address bidderaddress;
    uint bidder_money;
    
    //people
    uint NFTforme;
    
    uint NFTforpaimai;
    
    function do_nft(string memory _student_id) public payable{
        require(msg.value==1 ether);
        NFTforme = (uint)(keccak256(abi.encode(_student_id)));
    }
    
    function show_nft() public view returns(uint){
        return NFTforme;
    }
    
    function show_nftpaimai() public view returns(uint){
        return NFTforpaimai;
    }

    function show_paimai_time() public view returns(uint){
        return auctionendtime;
    }

    function show_paimai_giveraddress() public view returns(address){
        return giver_address;
    }

    function show_paimai_nft() public view returns(uint){
        return goal_NFT;
    }

    function show_paimai_moneydown() public view returns(uint){
        return money_down;
    }

    function show_paimai_bidderaddress() public view returns(address){
        return bidderaddress;
    }

    function show_paimai_moneyhigh() public view returns(uint){
        return bidder_money;
    }
    
    function do_paimai(uint _time, uint nft_number, uint moneydown) public{
        require(goal_NFT==0);
        uint endtime=_time+block.timestamp;
        auctionendtime = endtime;
        giver_address=msg.sender;
        goal_NFT=nft_number;
        money_down=moneydown;
        bidderaddress=(address)(0);
        bidder_money=0;
    }
    
    function end_paimai()public{
        require(auctionendtime<block.timestamp);
        NFTforpaimai=goal_NFT;
        auctionendtime=0;
        giver_address=(address)(0);
        goal_NFT=0;
        money_down=0;
        bidderaddress=(address)(0);
        bidder_money=0;
    }
    
    function buy_nft() public payable{
        require(auctionendtime>block.timestamp);
        require(msg.value>bidder_money);
        address((uint160)(bidderaddress)).transfer(bidder_money);
        bidder_money = msg.value;
        bidderaddress = msg.sender;
    }
}
