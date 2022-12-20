import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Collapsible from "react-collapsible";
import { truncate } from "./utils";
import Container from "react-bootstrap/Container";

function Block({ block }) {
  function renderHeader() {
    return block.number ? (
      <Container fluid>
        <Row>
          <Col>Block: {block.number}</Col>
          <Col>Miner: {truncate(block.miner)}</Col>
        </Row>
      </Container>
    ) : block.blockNumber ? (
      <Container fluid>
        <Row>
          <Col>From: {truncate(block.from)}</Col>
          <Col>To: {truncate(block.to)}</Col>
        </Row>
      </Container>
    ) : (
      "..."
    );
  }
  function renderBlock() {
    const entries = Object.entries(block);
    const cols = [];
    entries.forEach(([key, value]) => {
      if (key !== "transactions")
        cols.push(
          <Col key={key}>
            {key}: {truncate(value)}
          </Col>
        );
    });
    const rows = [];
    for (let index = 0; index < cols.length; index += 2) {
      rows.push(
        <Row>{cols.slice(index, Math.min(index + 2, cols.length))}</Row>
      );
    }
    return rows;
  }
  function renderTransactions() {
    // if (Array.isArray(transactions)) { transactions.map(tx => console.log(tx))};
    return (
      <Collapsible trigger={<h5>Transactions</h5>}>
        {block.transactions.map((tx) => (
          <Block key={tx.hash} block={tx} />
        ))}
      </Collapsible>
    );
  }
  return (
    <Container>
      <Collapsible trigger={renderHeader(block)}>
        <hr />
        <Container fluid>{renderBlock()}</Container>
        {block.transactions ? <hr/> : null}
        {block.transactions ? renderTransactions() : null}
      </Collapsible>
    </Container>
  );
}

export default Block;
