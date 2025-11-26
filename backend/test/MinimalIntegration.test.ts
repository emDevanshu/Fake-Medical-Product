import { expect } from "chai";
import hre from "hardhat";
import { MedicalProduct } from "../typechain-types";

describe("MedicalProduct Minimal Integration", function () {
    it("Should execute the full supply chain happy path", async function () {
        // 1. Deploy Contract
        const MedicalProductFactory = await hre.ethers.getContractFactory("MedicalProduct");
        const medicalProduct = await MedicalProductFactory.deploy();

        const toBytes32 = (text: string) => hre.ethers.encodeBytes32String(text);

        // Test Data
        const mfrId = toBytes32("MFR_1");
        const sellerId = toBytes32("SELLER_1");
        const consumerId = toBytes32("CONS_1");
        const productSN = toBytes32("SN_123");
        const brand = toBytes32("BrandX");
        const date = toBytes32("2023-10-27");

        // 2. Register Manufacturer
        await medicalProduct.registerManufacturer(mfrId, toBytes32("Mfr Name"), brand);

        // 3. Add Seller (linked to Manufacturer)
        await medicalProduct.addSeller(
            mfrId,
            toBytes32("Seller Name"),
            brand,
            sellerId,
            123456,
            toBytes32("Manager"),
            toBytes32("Address")
        );

        // 4. Add Product
        await medicalProduct.addProduct(
            mfrId,
            toBytes32("Mfr Name"),
            toBytes32("Product Name"),
            productSN,
            brand,
            100, // Price
            1,   // Product ID
            date
        );

        // 5. Manufacturer sells to Seller
        await medicalProduct.manufacturerSellProduct(productSN, sellerId, mfrId, date);

        // 6. Seller sells to Consumer
        await medicalProduct.sellerSellProduct(productSN, consumerId, date);

        // 7. Verify Ownership
        const [isValid] = await medicalProduct.verifyProduct(productSN, consumerId);
        expect(isValid).to.be.true;

        // 8. Verify Status
        const status = await medicalProduct.checkStatus(productSN);
        expect(status).to.equal(toBytes32("Sold"));
    });
});
