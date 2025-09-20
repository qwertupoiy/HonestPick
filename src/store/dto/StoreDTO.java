package store.dto;

import java.sql.Date;
import java.util.List;

public class StoreDTO {
	private int StoreNo;
	private int MemberNo;
	private String StoreCategory;
	private String StoreName;
	private String OfficeName;
	private String StoreContact;
	private String StorePostalCode;
	private String StoreAddr;
	private String StoreStreetAddr;
	private String StoreAdditionalInfo;
	private String StoreBusinessNum;
	private String StoreImage;
	private String StoreSchedule;
	private String StoreComment;
	private String StoreFacilities;
	private String OwnerName;
	private Date StoreRegidate;
	private Date StoreUpdate;
	private Date MemberShip;
	private String State;
	private MenuDTO Menu;
	private ReviewDTO Review;
	private String OpenTime;           // "09:00"
    private String CloseTime;          // "22:00"  
    private List<String> OperatingDays; // ["주중", "주말"]
    private List<String> Facilities;    // ["주차 가능", "예약 가능", ...]
    private String BusinessStatus;     // "영업중", "휴무일" 등
	
	public int getStoreNo() {
		return StoreNo;
	}
	public void setStoreNo(int storeNo) {
		StoreNo = storeNo;
	}
	public int getMemberNo() {
		return MemberNo;
	}
	public void setMemberNo(int memberNo) {
		MemberNo = memberNo;
	}
	public String getStoreCategory() {
		return StoreCategory;
	}
	public void setStoreCategory(String storeCategory) {
		StoreCategory = storeCategory;
	}
	public String getStoreName() {
		return StoreName;
	}
	public void setStoreName(String storeName) {
		StoreName = storeName;
	}
	public String getOfficeName() {
		return OfficeName;
	}
	public void setOfficeName(String officeName) {
		OfficeName = officeName;
	}
	public String getStoreContact() {
		return StoreContact;
	}
	public void setStoreContact(String storeContact) {
		StoreContact = storeContact;
	}
	public String getStorePostalCode() {
		return StorePostalCode;
	}
	public void setStorePostalCode(String storePostalCode) {
		StorePostalCode = storePostalCode;
	}
	public String getStoreAddr() {
		return StoreAddr;
	}
	public void setStoreAddr(String storeAddr) {
		StoreAddr = storeAddr;
	}
	public String getStoreStreetAddr() {
		return StoreStreetAddr;
	}
	public void setStoreStreetAddr(String storeStreetAddr) {
		StoreStreetAddr = storeStreetAddr;
	}
	public String getStoreAdditionalInfo() {
		return StoreAdditionalInfo;
	}
	public void setStoreAdditionalInfo(String storeAdditionalInfo) {
		StoreAdditionalInfo = storeAdditionalInfo;
	}
	public String getStoreBusinessNum() {
		return StoreBusinessNum;
	}
	public void setStoreBusinessNum(String storeBusinessNum) {
		StoreBusinessNum = storeBusinessNum;
	}
	public String getStoreImage() {
		return StoreImage;
	}
	public void setStoreImage(String storeImage) {
		StoreImage = storeImage;
	}
	public String getStoreSchedule() {
		return StoreSchedule;
	}
	public void setStoreSchedule(String storeSchedule) {
		StoreSchedule = storeSchedule;
	}
	public String getStoreComment() {
		return StoreComment;
	}
	public void setStoreComment(String storeComment) {
		StoreComment = storeComment;
	}
	public String getStoreFacilities() {
		return StoreFacilities;
	}
	public void setStoreFacilities(String storeFacilities) {
		StoreFacilities = storeFacilities;
	}
	public String getOwnerName() {
		return OwnerName;
	}
	public void setOwnerName(String ownerName) {
		OwnerName = ownerName;
	}
	public Date getStoreRegidate() {
		return StoreRegidate;
	}
	public void setStoreRegidate(Date storeRegidate) {
		StoreRegidate = storeRegidate;
	}
	public Date getStoreUpdate() {
		return StoreUpdate;
	}
	public void setStoreUpdate(Date storeUpdate) {
		StoreUpdate = storeUpdate;
	}
	public Date getMemberShip() {
		return MemberShip;
	}
	public void setMemberShip(Date memberShip) {
		MemberShip = memberShip;
	}
	public String getState() {
		return State;
	}
	public void setState(String state) {
		State = state;
	}
	public MenuDTO getMenu() {
		return Menu;
	}
	public void setMenu(MenuDTO menu) {
		Menu = menu;
	}
	public ReviewDTO getReview() {
		return Review;
	}
	public void setReview(ReviewDTO review) {
		Review = review;
	}
	public String getOpenTime() {
		return OpenTime;
	}
	public void setOpenTime(String openTime) {
		OpenTime = openTime;
	}
	public String getCloseTime() {
		return CloseTime;
	}
	public void setCloseTime(String closeTime) {
		CloseTime = closeTime;
	}
	public List<String> getOperatingDays() {
		return OperatingDays;
	}
	public void setOperatingDays(List<String> operatingDays) {
		OperatingDays = operatingDays;
	}
	public List<String> getFacilities() {
		return Facilities;
	}
	public void setFacilities(List<String> facilities) {
		Facilities = facilities;
	}
	public String getBusinessStatus() {
		return BusinessStatus;
	}
	public void setBusinessStatus(String businessStatus) {
		BusinessStatus = businessStatus;
	}
}