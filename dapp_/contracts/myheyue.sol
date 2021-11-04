pragma solidity >=0.4.21 <0.7.0;
pragma experimental ABIEncoderV2;

contract paimai{
    
    //address bidder_address
    
    //bytes32 NFT_hash_number;
    
    
    struct event_paimai{
        uint auctionendtime;
        address giver_address;
        uint goal_NFT; 
        uint money_down;
        //time
        address bidderaddress;
        uint money_highest;
        //mapping(uint => bidder) biddermap;
        //bidder[] biddermap;
    }
    uint paimaiaccount;
    //mapping(uint => event_paimai) paimaimap;
    event_paimai[] public paimaimap;
    
    struct giver{
        //address giver_address;
        uint NFTallamount;
        uint[] nftall;
        uint NFTaccountforme;
        //mapping(uint => NFT) nftmapforme;
        uint[] nftmapforme;
        uint NFTaccountforpaimai;
        //mapping(uint => NFT) nftmapforpaimai;
        uint[] nftmapforpaimai;
        uint personalmaiaccount;
        //mapping(uint => event_paimai) personalmaimap;
        event_paimai[] personalmaimap;
        uint personalpaiaccount;
        //mapping(uint => event_paimai) personalpaimap;
        event_paimai[] personalpaimap;
    }
    //uint giveraccount;
    mapping(address => giver) givermap;
    //giver[] public givermap;
    
    //do NFT
    function do_nft (string memory _student_id) public payable{
        //payable
        require(msg.value==1);
        
        givermap[msg.sender].nftmapforme.push((uint)(keccak256(abi.encode(_student_id))));
        //givermap[msg.sender].nftmapforme.push((bytes memory)(1));
        givermap[msg.sender].nftall.push((uint)(keccak256(abi.encode(_student_id))));
        //givermap[msg.sender].nftall.push((bytes memory)(1));
        
        givermap[msg.sender].NFTaccountforme++;
        givermap[msg.sender].NFTallamount++;
        
    }
    
    function showallpaimai() public view returns(event_paimai[] memory){
        return paimaimap;
    }
     
    //chakan zhuzao NFT
    function shownftforme() public view returns(uint[] memory){
        return givermap[msg.sender].nftmapforme;
    }
    
    //chakan paimai NFT
    function shownftforpaimai() public view returns(uint[] memory){
        return givermap[msg.sender].nftmapforpaimai;
    }
    
    //chakan pai de NFT
    function shownftforpai() public view returns(event_paimai[] memory){
        return givermap[msg.sender].personalpaimap;
    }
    
    //chakan mai de NFT
    function shownftformai() public view returns(event_paimai[] memory){
        return givermap[msg.sender].personalmaimap;
    }
    
    //paimai ziji de NFT
    function newevent_paimai(uint ftpaddress, uint _money_down, uint _time)  public{
        paimaiaccount++;
        uint endtime=_time+block.timestamp;
        paimaimap.push(event_paimai(endtime,msg.sender, ftpaddress, _money_down, (address)(0) ,0));
        
        givermap[msg.sender].personalmaiaccount++;
        givermap[msg.sender].personalmaimap.push(event_paimai(endtime,msg.sender,ftpaddress,_money_down,(address)(0),0));
    }
    
    //pai bieren de NFT
    function event_pai(uint _paimaiindex)  public payable{
        //time 
        require(block.timestamp<paimaimap[_paimaiindex].auctionendtime);
        require(msg.value>paimaimap[_paimaiindex].money_highest);
        //payable
        //return the money
        address((uint160)(paimaimap[_paimaiindex].bidderaddress)).transfer(paimaimap[_paimaiindex].money_highest);
        
        paimaimap[_paimaiindex].money_highest = msg.value;
        paimaimap[_paimaiindex].bidderaddress = msg.sender;
        
        givermap[msg.sender].personalpaiaccount++;
        givermap[msg.sender].personalpaimap.push(event_paimai(paimaimap[_paimaiindex].auctionendtime,paimaimap[_paimaiindex].giver_address, paimaimap[_paimaiindex].goal_NFT, paimaimap[_paimaiindex].money_down,msg.sender,msg.value));
    }
    
    function endthepaimai(uint _paimaiindex) public{
        givermap[paimaimap[_paimaiindex].bidderaddress].nftmapforpaimai.push(paimaimap[_paimaiindex].goal_NFT);
    }
    
    
}