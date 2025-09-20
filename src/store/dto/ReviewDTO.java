package store.dto;

import java.sql.Date;

import member.dto.MemberDTO;

public class ReviewDTO {
	private int ReviewNo;
	private String ReviewTitle;
	private String ReviewContent;
	private float ReviewEstimation;
	private int ReviewCount;
	private int ReviewRecommendation;
	private String ReviewImage;
	private Date ReviewRegidate;
	private Date ReviewUpdate;
	private int MemberNo;
	private int StoreNo;
	private int ResNo;
	private String MemberNickname;
	private String MemberImage;
	private StoreDTO Store;
	private MemberDTO Member;
	
	public int getReviewNo() {
		return ReviewNo;
	}
	public void setReviewNo(int reviewNo) {
		ReviewNo = reviewNo;
	}
	public String getReviewTitle() {
		return ReviewTitle;
	}
	public void setReviewTitle(String reviewTitle) {
		ReviewTitle = reviewTitle;
	}
	public String getReviewContent() {
		return ReviewContent;
	}
	public void setReviewContent(String reviewContent) {
		ReviewContent = reviewContent;
	}
	public float getReviewEstimation() {
		return ReviewEstimation;
	}
	public void setReviewEstimation(float reviewEstimation) {
		ReviewEstimation = reviewEstimation;
	}
	// ReviewEstimation 소수점 2번째 자리에서 올림
    public float getRoundedReviewEstimation() {
        return Math.round(ReviewEstimation * 10.0f) / 10.0f;
    }
	public int getReviewCount() {
		return ReviewCount;
	}
	public void setReviewCount(int reviewCount) {
		ReviewCount = reviewCount;
	}
	public int getReviewRecommendation() {
		return ReviewRecommendation;
	}
	public void setReviewRecommendation(int reviewRecommendation) {
		ReviewRecommendation = reviewRecommendation;
	}
	public String getReviewImage() {
		return ReviewImage;
	}
	public void setReviewImage(String reviewImage) {
		ReviewImage = reviewImage;
	}
	public Date getReviewRegidate() {
		return ReviewRegidate;
	}
	public void setReviewRegidate(Date reviewRegidate) {
		ReviewRegidate = reviewRegidate;
	}
	public Date getReviewUpdate() {
		return ReviewUpdate;
	}
	public void setReviewUpdate(Date reviewUpdate) {
		ReviewUpdate = reviewUpdate;
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
	public String getMemberNickname() {
		return MemberNickname;
	}
	public void setMemberNickname(String memberNickname) {
		MemberNickname = memberNickname;
	}
	public String getMemberImage() {
		return MemberImage;
	}
	public void setMemberImage(String memberImage) {
		MemberImage = memberImage;
	}
	public StoreDTO getStore() {
		return Store;
	}
	public void setStore(StoreDTO store) {
		Store = store;
	}
	public int getResNo() {
		return ResNo;
	}
	public void setResNo(int resNo) {
		ResNo = resNo;
	}
	public MemberDTO getMember() {
		return Member;
	}
	public void setMember(MemberDTO member) {
		Member = member;
	}
}
