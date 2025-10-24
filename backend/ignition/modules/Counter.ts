import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("CounterModule", (m) => {
  const counter = m.contract("MedicalProduct.sol");

  m.call(counter, "incBy", [5n]);

  return { counter };
});
