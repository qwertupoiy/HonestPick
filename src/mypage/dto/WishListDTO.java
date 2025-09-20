package mypage.dto;

import store.dto.ReviewDTO;
import store.dto.StoreDTO;

public class WishListDTO {
	private Integer WishNo;
	private int MemberNo;
	private int StoreNo;
	private StoreDTO Store;
	private ReviewDTO Review;
	
	public Integer getWishNo() {
		return WishNo;
	}
	public void setWishNo(Integer wishNo) {
		WishNo = wishNo;
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
	public StoreDTO getStore() {
		return Store;
	}
	public void setStore(StoreDTO store) {
		Store = store;
	}
	public ReviewDTO getReview() {
		return Review;
	}
	public void setReview(ReviewDTO review) {
		Review = review;
	}
}
