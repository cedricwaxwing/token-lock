import { useConnect } from "wagmi"
import Modal from "react-modal"
import cls from "./Modal.module.css"
import Image from "next/image"

interface Props {
  onRequestClose(): void
}
const ConnectModal: React.FC<Props> = ({ onRequestClose }) => {
  const [{ data, error }, connect] = useConnect()

  return (
    <Modal isOpen onRequestClose={onRequestClose} className={cls.container}>
      <h2>
        Select a Wallet
      </h2>
      <p className={cls.textSmall}>
        Please select a wallet to connect to lock your GNO.
      </p>
      {data.connectors.map((connector) => (
        <button
          className={cls.wallet}
          disabled={!connector.ready}
          key={connector.id}
          onClick={async () => {
            const result = await connect(connector)
            if (result?.data?.account) {
              onRequestClose()
            }
          }}
        >
          <Image
            src={`/${connector.name.split(" ")[0]}.svg`}
            alt={`${connector.name}`}
            height={32}
            width={32}
          />
          <strong className={cls.walletLabel}>
            {connector.name}
            {!connector.ready && " (unsupported)"}
          </strong>
        </button>
      ))}

      {error && <div>{error?.message ?? "Failed to connect"}</div>}
    </Modal>
  )
}

export default ConnectModal
