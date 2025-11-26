// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

contract MedicalProduct {

    struct Medicine {
        uint256 productId;
        bytes32 productSN;
        bytes32 medName;
        uint256 medcount;
        bytes32 brand;
    }

    struct Manufac {
        bytes32 manufacturerId;
        bytes32 manufacturerName;
        bytes32[] productBrand;
        uint256[] productIds;
        mapping(uint256 => Medicine) products; // pid=>Medicine
        // Example: "Novartis", "Roche", "Sun Pharma", "Dr. Reddy’s" etc.
        // To be added later
        // bytes32 manufacturerLocation;
        // uint256 registrationTime;
        // address owner;                // Only this address can add products
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

    mapping(bytes32 => productItem) public productItems; // PSN => ProductItem, stores the details of the product based on the PSN
    mapping(bytes32 => bytes32) public productsManufactured; // PSN => MID
    mapping(bytes32 => bytes32) public productsForSale; // PSN=>SID Mapping PSN to SID, to keep track that what belongs to which seller, and prevent double selling
    mapping(bytes32 => bytes32) public productsSold; // PSN => CID
    mapping(bytes32 => bytes32[]) public productsWithSeller; // iss seller pe SID => yeh falana medicines h
    mapping(bytes32 => bytes32[]) public productsWithConsumer; // iss consumer pe CID => yeh falana medicines h
    mapping(bytes32 => bytes32[]) public sellersWithManufacturer; // is manufac pe MID => yeh falana seller SID h
    // Fast lookup to check whether a seller is already associated with a manufacturer
    mapping(bytes32 => mapping(bytes32 => bool)) public isSellerAssociated; // manufacturerId => sellerId => bool
    mapping(bytes32 => bytes32) public manufacturedTime; // PSN => time of manufacturing
    mapping(bytes32 => bytes32) public manufacturerToSellerTime; // PSN => time of manufac selling to seller
    mapping(bytes32 => bytes32) public sellingTime; // PSN => time of selling item to consumer

    mapping(bytes32 => bool) public isAcknowledged;            // productSN => acknowledged flag
    mapping(bytes32 => bytes32) public acknowledgedBy;         // productSN => sellerId
    mapping(bytes32 => bytes32) public acknowledgedTime;       // productSN => time (bytes32)

    // ✅ EVENTS
    event ManufacturerRegistered(bytes32 manufacturerId, bytes32 manufacturerName, bytes32 productBrand);
    event ProductAdded(bytes32 manufacturerId, uint256 productId, bytes32 productSN, bytes32 productName);
    event SellerAdded(bytes32 indexed manufacturerId, bytes32 indexed sellerId);
    event ProductVerified(bytes32 indexed productSN, bytes32 manufacturerId, uint256 productId, bytes32 productName, bytes32 productBrand, uint256 productPrice, bytes32 productStatus, bytes32 productTime, bytes32 currentOwner);
    event DeliveryAcknowledged(bytes32 indexed productSN, bytes32 indexed sellerId, bytes32 time);

    //SELLER SECTION
    //✅
    function addSeller(bytes32 _manufacturerId, bytes32 _sellerName, bytes32 _sellerBrand, bytes32 _sellerID,
        uint256 _sellerNum, bytes32 _sellerManager, bytes32 _sellerAddress) public {

        require(!isSellerAssociated[_manufacturerId][_sellerID], "Seller already associated with this manufacturer");

        // 2) If this seller does not exist globally yet, create the global seller record
        if (sellers[_sellerID].sellerId == bytes32(0)) {
            sellers[_sellerID] = seller(
                _sellerID,
                _sellerName,
                _sellerBrand,
                _sellerNum,
                _sellerManager,
                _sellerAddress
            );
        }

        // 3) Associate seller with this manufacturer
        sellersWithManufacturer[_manufacturerId].push(_sellerID);
        isSellerAssociated[_manufacturerId][_sellerID] = true;

        emit SellerAdded(_manufacturerId, _sellerID);
    }

    function checkSellerConflict(
        bytes32 _sellerID,
        bytes32 _sellerName,
        bytes32 _sellerBrand,
        uint256 _sellerNum,
        bytes32 _sellerManager,
        bytes32 _sellerAddress
    )
    public view returns (bool exists, bool hasConflict, seller memory existingSeller)
    {
        seller memory s = sellers[_sellerID];

        // Case 1: Seller does not exist at all
        if (s.sellerId == bytes32(0)) { return (false, false, s); }

        // Case 2: Seller exists → check mismatch
        bool conflict =
            (s.sellerName != _sellerName) ||
            (s.sellerBrand != _sellerBrand) ||
            (s.sellerNum != _sellerNum) ||
            (s.sellerManager != _sellerManager) ||
            (s.sellerAddress != _sellerAddress);

        return (true, conflict, s);
    }

    function registerManufacturer(bytes32 _manufacturerID, bytes32 _manufacturerName, bytes32 _productBrand) public {
        require(manufacturers[_manufacturerID].manufacturerId == bytes32(0) , "Manufacturer already registered");

        Manufac storage m = manufacturers[_manufacturerID];

        m.manufacturerId = _manufacturerID;
        m.manufacturerName = _manufacturerName;
//        m.productBrand = _productBrand;
        m.productBrand.push(_productBrand);

        emit ManufacturerRegistered(_manufacturerID, _manufacturerName, _productBrand);
    }

    //PRODUCT SECTION
    //✅
    function addProduct(bytes32 _manufacturerID, bytes32 _manufacturerName, bytes32 _productName, bytes32 _productSN, bytes32 _productBrand,
        uint256 _productPrice, uint256 _productID, bytes32 _productTime) public {

        productItems[_productSN] = productItem(_manufacturerID, _productID, _productSN, _productName, _productBrand, _productPrice, "Available", _productTime);
        productsManufactured[_productSN] = _manufacturerID;
        manufacturedTime[_productSN] = _productTime;

        Manufac storage manufacturer = manufacturers[_manufacturerID];

        // If new manufacturer, initialize
        if (manufacturer.manufacturerId == 0) {
            manufacturer.manufacturerId = _manufacturerID;
            manufacturer.manufacturerName = _manufacturerName;
        }

        // Add brand only if not already present
        bool brandExists = false;
        for (uint i = 0; i < manufacturer.productBrand.length; i++) {
            if (manufacturer.productBrand[i] == _productBrand) {
                brandExists = true;
                break;
            }
        }
        if (!brandExists) {
            manufacturer.productBrand.push(_productBrand);
        }

        // increasing the medcount
        Medicine storage medicine = manufacturer.products[_productID];
        if (medicine.productId == 0) {
            medicine.productId = _productID;
            medicine.medName = _productName;
            medicine.productSN = _productSN;
            medicine.brand = _productBrand;
            manufacturer.productIds.push(_productID);
        }
        medicine.medcount++;

        emit ProductAdded(_manufacturerID, _productID, _productSN, _productName);
    }

    //✅
    function queryInventory(bytes32 _manufacturerId) public view returns (uint256[] memory, bytes32[] memory, bytes32[] memory, uint256[] memory, uint256) {
        uint256 countOfProducts = manufacturers[_manufacturerId].productIds.length;
        uint256[] memory pids = manufacturers[_manufacturerId].productIds;

        bytes32[] memory pnames = new bytes32[](countOfProducts);
        bytes32[] memory pbrands = new bytes32[](countOfProducts);
        uint256[] memory pcounts = new uint256[](countOfProducts);


        for (uint256 i = 0; i < countOfProducts; i++) {
            Medicine storage medicine = manufacturers[_manufacturerId].products[pids[i]];
            pnames[i] = medicine.medName;
            pbrands[i] = medicine.brand;
            pcounts[i] = medicine.medcount;
        }

//        bytes32 pbrand = manufacturers[_manufacturerId].productBrand;

        return (pids, pnames, pbrands, pcounts, countOfProducts);
    }

    //SELL Product
    //✅
    function manufacturerSellProduct(bytes32 _productSN, bytes32 _sellerID, bytes32 _manufacturerID, bytes32 _productTime) public {
        // Prevent double selling, by checking whether the PSN hasn't been already sold to some seller.
        require(productsForSale[_productSN] == bytes32(0), "Double selling is not allowed. Product is already sold to some other seller!");

        // Check if the product exists.
        require(productItems[_productSN].productId != 0,"Product doesn't exist");

        require(sellers[_sellerID].sellerId != 0, "Seller does not exist");

        require(isSellerAssociated[_manufacturerID][_sellerID] == true, "Seller is not associated with this manufacturer");

        require(productItems[_productSN].manufacturerId == _manufacturerID, "Unauthorized sale attempt: Product belongs to another manufacturer");

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

    // ===== View function: return product + owner + acknowledgement info =====
    function verifyProductForSeller(bytes32 _productSN)
    public
    view
    returns (
        bool exists,
        bytes32 manufacturerId,
        uint256 productId,
        bytes32 productName,
        bytes32 productBrand,
        uint256 productPrice,
        bytes32 productStatus,
        bytes32 productTime,
        bytes32 currentOwner,
        bool acknowledged,
        bytes32 acknowledgedAt
    )
    {
        // check existence
        if (productItems[_productSN].productId == 0) {
            return (false, bytes32(0), 0, bytes32(0), bytes32(0), 0, bytes32(0), bytes32(0), bytes32(0), false, bytes32(0));
        }

        productItem memory p = productItems[_productSN];
        bytes32 owner = productsForSale[_productSN]; // seller id if sold, else 0

        bool ack = isAcknowledged[_productSN];
        bytes32 ackt = acknowledgedTime[_productSN];

        return (
            true,
            p.manufacturerId,
            p.productId,
            p.productName,
            p.productBrand,
            p.productPrice,
            p.productStatus,
            p.productTime,
            owner,
            ack,
            ackt
        );
    }

    // ===== Read helper: get list of products dispatched to a seller =====
    function getProductsForSeller(bytes32 _sellerId) public view returns (bytes32[] memory) {
        return productsWithSeller[_sellerId];
    }

    // ===== Seller acknowledges delivery of a product =====
    function sellerAcknowledgeDelivery(bytes32 _productSN, bytes32 _sellerID, bytes32 _ackTime) public {
        // 1) product must exist
        require(productItems[_productSN].productId != 0, "Product doesn't exist");

        // 2) it must have been sold to this seller
        require(productsForSale[_productSN] == _sellerID, "Product not sold to this seller");

        // 3) seller must be associated with the product's manufacturer
        bytes32 manufacturerId = productsManufactured[_productSN];
        require(isSellerAssociated[manufacturerId][_sellerID], "Seller not associated with manufacturer");

        // 4) ensure not acknowledged already
        require(!isAcknowledged[_productSN], "Already acknowledged");

        // mark ack
        isAcknowledged[_productSN] = true;
        acknowledgedBy[_productSN] = _sellerID;
        acknowledgedTime[_productSN] = _ackTime;

        emit DeliveryAcknowledged(_productSN, _sellerID, _ackTime);
    }

}
