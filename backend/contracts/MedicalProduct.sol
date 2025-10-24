// SPDX-License-Identifier: MIT

pragma solidity ^0.8.21;

contract product {

  struct Medicine {
    uint256 productId;
    bytes32 medName;
    uint256 medcount;
  }

  struct Manufac {
    bytes32 manufacturerId;
    bytes32 productBrand;
    uint256[] productIds;
    mapping(uint256 => Medicine) products; // pid=>Medicine
  }

  mapping(bytes32 => Manufac) manufacturers; // mid=>Manufac

  struct seller {
    bytes32 sellerId;
    bytes32 sellerName;
    bytes32 sellerBrand;
    uint256 sellerNum;
    bytes32 sellerManager;
    bytes32 sellerAddress;
  }

  mapping(bytes32 => seller) public sellers;

  struct productItem {
    bytes32 manufacturerId;
    uint256 productId;
    bytes32 productSN;
    bytes32 productName;
    bytes32 productBrand;
    uint256 productPrice;
    bytes32 productStatus;
    bytes32 productTime;
  }

  mapping(bytes32 => productItem) public productItems;
  mapping(bytes32 => bytes32) public productsManufactured; // PSN => MID
  mapping(bytes32 => bytes32) public productsForSale; // yeh medicines available h seller pe, PSN=>SID
  mapping(bytes32 => bytes32) public productsSold; // PSN => CID
  mapping(bytes32 => bytes32[]) public productsWithSeller; // iss seller pe SID => yeh falana medicines h
  mapping(bytes32 => bytes32[]) public productsWithConsumer; // iss consumer pe CID => yeh falana medicines h
  mapping(bytes32 => bytes32[]) public sellersWithManufacturer; // is manufac pe MID => yeh falana seller SID h
  mapping(bytes32 => bytes32) public manufacturedTime; // PSN => time of manufacturing
  mapping(bytes32 => bytes32) public manufacturerToSellerTime; // PSN => time of manufac selling to seller
  mapping(bytes32 => bytes32) public sellingTime; // PSN => time of selling item to consumer

  //SELLER SECTION
  //✅
  function addSeller(bytes32 _manufacturerId, bytes32 _sellerName, bytes32 _sellerBrand, bytes32 _sellerID,
    uint256 _sellerNum, bytes32 _sellerManager, bytes32 _sellerAddress) public {
    sellers[_sellerID] = seller(_sellerID, _sellerName, _sellerBrand,
      _sellerNum, _sellerManager, _sellerAddress);

    sellersWithManufacturer[_manufacturerId].push(_sellerID);
  }

/*
    function viewSellers () public view returns(uint256[] memory, bytes32[] memory, bytes32[] memory, bytes32[] memory, uint256[] memory, bytes32[] memory, bytes32[] memory) {
        uint256[] memory ids = new uint256[](sellerCount);
        bytes32[] memory snames = new bytes32[](sellerCount);
        bytes32[] memory sbrands = new bytes32[](sellerCount);
        bytes32[] memory scodes = new bytes32[](sellerCount);
        uint256[] memory snums = new uint256[](sellerCount);
        bytes32[] memory smanagers = new bytes32[](sellerCount);
        bytes32[] memory saddress = new bytes32[](sellerCount);

        for(uint i=0; i<sellerCount; i++){
            ids[i] = sellers[i].sellerId;
            snames[i] = sellers[i].sellerName;
            sbrands[i] = sellers[i].sellerBrand;
            scodes[i] = sellers[i].sellerID;
            snums[i] = sellers[i].sellerNum;
            smanagers[i] = sellers[i].sellerManager;
            saddress[i] = sellers[i].sellerAddress;
        }
        return(ids, snames, sbrands, scodes, snums, smanagers, saddress);
    }
*/
  //PRODUCT SECTION
  //✅
  function addProduct(bytes32 _manufactuerID, bytes32 _productName, bytes32 _productSN, bytes32 _productBrand,
    uint256 _productPrice, uint256 _productID, bytes32 _productTime) public {
    productItems[_productSN] = productItem(_manufactuerID, _productID, _productSN, _productName, _productBrand, _productPrice, "Available", _productTime);
    productsManufactured[_productSN] = _manufactuerID;
    manufacturedTime[_productSN] = _productTime;

    if (manufacturers[_manufactuerID].manufacturerId == 0) {
      manufacturers[_manufactuerID].manufacturerId = _manufactuerID;
      manufacturers[_manufactuerID].productBrand = _productBrand;
    }

    // increasing the medcount
    Manufac storage manufacturer = manufacturers[_manufactuerID];
    Medicine storage medicine = manufacturer.products[_productID];
    if (medicine.productId == 0) {
      medicine.productId = _productID;
      medicine.medName = _productName;
      manufacturer.productIds.push(_productID);
    }
    medicine.medcount++;
  }

  //✅
  function queryInventory(bytes32 _manufacturerId) public view returns (uint256[] memory, bytes32[] memory, bytes32, uint256[] memory, uint256) {
    uint256 countOfProducts = manufacturers[_manufacturerId].productIds.length;
    uint256[] memory pids = manufacturers[_manufacturerId].productIds;

    bytes32[] memory pnames = new bytes32[](countOfProducts);
    uint256[] memory pcounts = new uint256[](countOfProducts);


    for (uint256 i = 0; i < countOfProducts; i++) {
      Medicine storage medicine = manufacturers[_manufacturerId].products[pids[i]];
      pnames[i] = medicine.medName;
      pcounts[i] = medicine.medcount;
    }

    bytes32 pbrands = manufacturers[_manufacturerId].productBrand;

    return (pids, pnames, pbrands, pcounts, countOfProducts);
  }

/*
    function viewProductItems () public view returns(uint256[] memory, bytes32[] memory, bytes32[] memory, bytes32[] memory, uint256[] memory, bytes32[] memory) {
        uint256[] memory pids = new uint256[](productCount);
        bytes32[] memory pSNs = new bytes32[](productCount);
        bytes32[] memory pnames = new bytes32[](productCount);
        bytes32[] memory pbrands = new bytes32[](productCount);
        uint256[] memory pprices = new uint256[](productCount);
        bytes32[] memory pstatus = new bytes32[](productCount);

        for(uint i=0; i<productCount; i++){
            pids[i] = productItems[i].productId;
            pSNs[i] = productItems[i].productSN;
            pnames[i] = productItems[i].productName;
            pbrands[i] = productItems[i].productBrand;
            pprices[i] = productItems[i].productPrice;
            pstatus[i] = productItems[i].productStatus;
        }
        return(pids, pSNs, pnames, pbrands, pprices, pstatus);
    }


*/
  //SELL Product
  //✅
  function manufacturerSellProduct(bytes32 _productSN, bytes32 _sellerID, bytes32 _productTime) public {
    productsWithSeller[_sellerID].push(_productSN);
    productsForSale[_productSN] = _sellerID;
    manufacturerToSellerTime[_productSN] = _productTime;

  }

  //✅
  function sellerSellProduct(bytes32 _productSN, bytes32 _consumerID, bytes32 _productTime) public {

    productItem storage item = productItems[_productSN];

    bytes32 pStatus = item.productStatus;
    if (pStatus == "Available") {
      item.productStatus = "Sold";
      productsWithConsumer[_consumerID].push(_productSN);
      productsSold[_productSN] = _consumerID;
      sellingTime[_productSN] = _productTime;

      //Reducing the medcount
      bytes32 manufacturerID = item.manufacturerId;
      uint256 productID = item.productId;
      Manufac storage manufacturer = manufacturers[manufacturerID];
      Medicine storage medicine = manufacturer.products[productID];
      medicine.medcount--;
    }
  }

  function checkStatus(bytes32 _productSN) public view returns (bytes32) {
    productItem storage item = productItems[_productSN];

    bytes32 pStatus = item.productStatus;
    return pStatus;
  }

  //✅
  function queryProductsList(bytes32 _sellerID) public view returns (bytes32[] memory, bytes32[] memory, bytes32[] memory, bytes32[] memory, uint256[] memory, bytes32[] memory){
    bytes32[] memory productSNs = productsWithSeller[_sellerID];
    uint256 len = productSNs.length;

    bytes32[] memory mids = new bytes32[](len);
    bytes32[] memory pnames = new bytes32[](len);
    bytes32[] memory pbrands = new bytes32[](len);
    uint256[] memory pprices = new uint256[](len);
    bytes32[] memory pstatus = new bytes32[](len);

    for (uint i = 0; i < len; i++) {
      bytes32 currPSN = productSNs[i];

      productItem storage item = productItems[currPSN];

      mids[i] = item.manufacturerId;
      pnames[i] = item.productName;
      pbrands[i] = item.productBrand;
      pprices[i] = item.productPrice;
      pstatus[i] = item.productStatus;
    }

    return (mids, productSNs, pnames, pbrands, pprices, pstatus);
  }

  //✅
  function querySellersList(bytes32 _manufacturerID) public view returns (bytes32[] memory, bytes32[] memory, bytes32[] memory, uint256[] memory, bytes32[] memory, bytes32[] memory) {
    bytes32[] memory sellerIds = sellersWithManufacturer[_manufacturerID];
    uint256 len = sellerIds.length;
    bytes32[] memory snames = new bytes32[](len);
    bytes32[] memory sbrands = new bytes32[](len);
    uint256[] memory snums = new uint256[](len);
    bytes32[] memory smanagers = new bytes32[](len);
    bytes32[] memory saddress = new bytes32[](len);


    for (uint i = 0; i < len; i++) {
      seller storage currSeller = sellers[sellerIds[i]];
      snames[i] = currSeller.sellerName;
      sbrands[i] = currSeller.sellerBrand;
      snums[i] = currSeller.sellerNum;
      smanagers[i] = currSeller.sellerManager;
      saddress[i] = currSeller.sellerAddress;
    }

    return (sellerIds, snames, sbrands, snums, smanagers, saddress);
  }

  //✅
  function getPurchaseHistory(bytes32 _consumerID) public view returns (bytes32[] memory, bytes32[] memory, bytes32[] memory, bytes32[] memory, bytes32[] memory, bytes32[] memory){
    bytes32[] memory productSNs = productsWithConsumer[_consumerID];
    uint256 len = productSNs.length;

    bytes32[] memory sellerIDs = new bytes32[](len);
    bytes32[] memory manufacturerIDs = new bytes32[](len);

    bytes32[] memory manufacturingTime = new bytes32[](len);
    bytes32[] memory manufacToSellerTime = new bytes32[](len);
    bytes32[] memory sellingtime = new bytes32[](len);

    for (uint i = 0; i < len; i++) {
      bytes32 currPSN = productSNs[i];
      sellerIDs[i] = productsForSale[currPSN];
      manufacturerIDs[i] = productsManufactured[currPSN];
      manufacturingTime[i] = manufacturedTime[currPSN];
      manufacToSellerTime[i] = manufacturerToSellerTime[currPSN];
      sellingtime[i] = sellingTime[currPSN];
    }
    return (productSNs, manufacturerIDs, manufacturingTime, sellerIDs, manufacToSellerTime, sellingtime);
  }

  //Verify

  //✅
  function verifyProduct(bytes32 _productSN, bytes32 _consumerID) public view returns (bool, string memory){
    string memory actualConsumer = bytes32ToString(productsSold[_productSN]);

    if (productsSold[_productSN] == _consumerID) {
      return (true, actualConsumer);
    }
    else {
      return (false, actualConsumer);
    }
  }

  function bytes32ToString(bytes32 _bytes32) internal pure returns (string memory) {
    bytes memory byteArray = new bytes(32);

    for (uint i = 0; i < 32; i++) {
      byteArray[i] = _bytes32[i];
    }

    return string(byteArray);
  }
}
