# 🏥 Fake Medical Product Identification using Blockchain & QR Code

This project provides an **open-source system to verify medical product authenticity** using **blockchain smart contracts + QR codes**.
Each product is serialized, stored immutably on blockchain, and later verified by consumers through a QR scan.

---

## 🔗 Core Idea

| Stakeholder            | Capability                                  |
| ---------------------- | ------------------------------------------- |
| Manufacturer           | Register product + generate QR code         |
| Distributor / Retailer | Update supply-chain status                  |
| Consumer               | Scan QR code → verify if product is genuine |

Blockchain ensures the records **cannot be modified or forged**, making counterfeit substitution detectable.

---

## 🧰 Tech Stack

| Layer                  | Technology         |
| ---------------------- | ------------------ |
| Smart Contracts        | Solidity + Hardhat |
| Frontend               | Angular            |
| Blockchain Interaction | Ethers.js          |
| Styling                | TailwindCSS        |
| Local Blockchain       | Ganache            |
| Wallet                 | MetaMask           |

---

## 🚀 Getting Started (Developer Setup)

### Prerequisites

* Node.js & npm
* MetaMask browser extension
* Ganache (or Hardhat local blockchain)

### Installation & Execution

```bash
npm install
npm run compile      # Compile smart contracts
npm run deploy       # Deploy to local blockchain
npm start            # Launch Angular frontend
```

After deployment, update the frontend config with the deployed contract address (instructions located in `/frontend/README.md` if applicable).

---

## 📂 Repository Structure (High-Level)

backend/contracts
  Solidity smart contracts

backend/scripts
  Deployment and blockchain utility scripts

fake-product-ui
  Angular application (QR generation + verification UI)

---

## 🧪 Testing

```bash
npx hardhat test    # Smart contract tests
```

> PRs that include additional tests or fix test coverage are highly appreciated.

---

## 🤝 How to Contribute

We welcome issues, pull requests, and feature ideas.

### Contribution Guidelines

1. Check **open issues** or create a new one to discuss a change
2. Fork the repository
3. Create a feature / fix branch
4. Submit a PR with a clear description
5. Ensure code is formatted and tests pass

### Good first issues

* Improving UI/UX of the dashboard
* Enhancing QR generation UI
* Adding new supply chain participant roles
* Improving contract event logging
* Expanding unit tests & error handling

---

## 🧭 OSS Principles Followed

* Transparency — Code and roadmap open to the community
* Collaboration — PRs, issues, and discussions welcome
* Quality over hierarchy — Contributions judged on merit
* Freedom — MIT License enables use, study, modify & distribute

---

## 📜 License

This project is released under the **MIT License** — making it easy for individuals, NGOs, universities, and organizations to use and extend.

---
