package store.dto;

import java.util.Date;

public class ReservationDTO {
	private int ResNo;
	private int MemberNo;
	private int StoreNo;
	private String ResComment;
	private String ResDate;
	private String ResTime;
    private Date ReservationDateTime;
	private String ResPeople;
	private Date ResRegidate;
	private Date ResUpdate;
    private String StoreImageName;
    private String StoreName;
    private String ChangeReason;
    private String Page;
    private int ReviewNo;
    
	public int getResNo() {
		return ResNo;
	}
	public void setResNo(int resNo) {
		ResNo = resNo;
	}
	public int getMemberNo() {
		return MemberNo;
	}
	public void setMemberNo(int memberNo) {
		MemberNo = memberNo;
	}
	public int getStoreNo() {
		return StoreNo;
	}
	public void setStoreNo(int storeNo) {
		StoreNo = storeNo;
	}
	public String getResComment() {
		return ResComment;
	}
	public void setResComment(String resComment) {
		ResComment = resComment;
	}
	public String getResDate() {
		return ResDate;
	}
	public void setResDate(String resDate) {
		ResDate = resDate;
	}
	public String getResTime() {
		return ResTime;
	}
	public void setResTime(String resTime) {
		ResTime = resTime;
	}
	public Date getReservationDateTime() {
		return ReservationDateTime;
	}
	public void setReservationDateTime(Date reservationDateTime) {
		ReservationDateTime = reservationDateTime;
	}
	public String getResPeople() {
		return ResPeople;
	}
	public void setResPeople(String resPeople) {
		ResPeople = resPeople;
	}
	public Date getResRegidate() {
		return ResRegidate;
	}
	public void setResRegidate(Date resRegidate) {
		ResRegidate = resRegidate;
	}
	public Date getResUpdate() {
		return ResUpdate;
	}
	public void setResUpdate(Date resUpdate) {
		ResUpdate = resUpdate;
	}
	public String getStoreImageName() {
		return StoreImageName;
	}
	public void setStoreImageName(String storeImageName) {
		StoreImageName = storeImageName;
	}
	public String getStoreName() {
		return StoreName;
	}
	public void setStoreName(String storeName) {
		StoreName = storeName;
	}
	public String getChangeReason() {
		return ChangeReason;
	}
	public void setChangeReason(String changeReason) {
		ChangeReason = changeReason;
	}
	public String getPage() {
		return Page;
	}
	public void setPage(String page) {
		this.Page = page;
	}
	public int getReviewNo() {
		return ReviewNo;
	}
	public void setReviewNo(int reviewNo) {
		ReviewNo = reviewNo;
	}
}