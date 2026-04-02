import Card from "../../ui/Card";

interface BillCardProps {
  // Add props here
  unstyled: boolean;
  compact: boolean;
}

const BillCard: React.FC<BillCardProps> = ({ unstyled, compact }) => {

  const content = (
    <div className="bill-card">
      {/* Add bill card content here */}
      Bill Card
    </div>
  );

  if (unstyled) {
    return <div className={compact ? "p-3" : "p-4"}>{content}</div>;
  }

  return (
    <Card className={compact ? "rounded-xl p-3 my-3" : "rounded-xl p-4"}>
      {content}
    </Card>
  );
};

export default BillCard;