package mypage.dto;

public class MemberShipDTO {
	private Integer StoreNo;
	private String State;
	private String PaymentKey;
	private String OrderId;
	private String MemberShipPlan;
	private String PaymentMethod;
	private int SelectedPrice;
	private int SelectedMonths;
	private String PaymentResult;
	private String MemberShipUpdate;
	
	public Integer getStoreNo() {
		return StoreNo;
	}
	public void setStoreNo(Integer storeNo) {
		StoreNo = storeNo;
	}
	public String getState() {
		return State;
	}
	public void setState(String state) {
		State = state;
	}
	public String getPaymentKey() {
		return PaymentKey;
	}
	public void setPaymentKey(String paymentKey) {
		PaymentKey = paymentKey;
	}
	public String getOrderId() {
		return OrderId;
	}
	public void setOrderId(String orderId) {
		OrderId = orderId;
	}
	public String getMemberShipPlan() {
		return MemberShipPlan;
	}
	public void setMemberShipPlan(String memberShipPlan) {
		MemberShipPlan = memberShipPlan;
	}
	public String getPaymentMethod() {
		return PaymentMethod;
	}
	public void setPaymentMethod(String paymentMethod) {
		PaymentMethod = paymentMethod;
	}
	public int getSelectedPrice() {
		return SelectedPrice;
	}
	public void setSelectedPrice(int selectedPrice) {
		SelectedPrice = selectedPrice;
	}
	public int getSelectedMonths() {
		return SelectedMonths;
	}
	public void setSelectedMonths(int selectedMonths) {
		SelectedMonths = selectedMonths;
	}
	public String getPaymentResult() {
		return PaymentResult;
	}
	public void setPaymentResult(String paymentResult) {
		PaymentResult = paymentResult;
	}
	public String getMemberShipUpdate() {
		return MemberShipUpdate;
	}
	public void setMemberShipUpdate(String memberShipUpdate) {
		MemberShipUpdate = memberShipUpdate;
	}
}
