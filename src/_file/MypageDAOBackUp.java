package _file;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import config.DB;
import mypage.dto.WishListDTO;
import store.dto.ReservationDTO;
import store.dto.ReviewDTO;
import store.dto.StoreDTO;

public class MypageDAOBackUp {
	Connection conn = null;
	PreparedStatement pstmt = null;
	ResultSet rs = null;
	
	// Reservation
	public List<ReservationDTO> getSelectAllRes(ReservationDTO dtoPm) {
		List<ReservationDTO> list = new ArrayList<>();
		try {
			conn = DB.dbConn();
			String sql = "SELECT r.ResNo, r.MemberNo, r.StoreNo, r.ResComment, r.ResDate, r.ResTime, "
					+ "r.ResPeople, r.ResRegidate, r.ResUpdate, s.StoreImage AS StoreImageName, s.StoreName AS StoreName "
					+ "FROM Reservation r JOIN Store s ON r.StoreNo = s.StoreNo "
					+ "WHERE r.MemberNo = ?";
			if (dtoPm.getPage().equals("res")) {
				sql += " AND TO_DATE(r.ResDate, 'YYYY-MM-DD') >= TRUNC(SYSDATE) ORDER BY ResDate DESC";
			} else if (dtoPm.getPage().equals("visit")) {
				sql += " AND TO_DATE(r.ResDate, 'YYYY-MM-DD') < TRUNC(SYSDATE) ORDER BY ResDate DESC";
			} else {
				sql += " ORDER BY ResDate DESC";
			}
			pstmt = conn.prepareStatement(sql);
			pstmt.setInt(1, dtoPm.getMemberNo());
			rs = pstmt.executeQuery();
			while (rs.next()) {
				ReservationDTO dto = new ReservationDTO();
				dto.setResNo(rs.getInt("ResNo"));
				dto.setMemberNo(rs.getInt("MemberNo"));
				dto.setStoreNo(rs.getInt("StoreNo"));
				dto.setResComment(rs.getString("ResComment"));
				dto.setResDate(rs.getString("ResDate"));
				dto.setResTime(rs.getString("ResTime"));
				dto.setResPeople(rs.getString("ResPeople"));
				dto.setResRegidate(rs.getDate("ResRegidate"));
				dto.setResUpdate(rs.getDate("ResUpdate"));
				dto.setStoreName(rs.getString("StoreName"));
				
				// split ImageName
				String storeImageStr = rs.getString("StoreImageName");
				if (storeImageStr != null && storeImageStr.contains("|")) {
				    String[] imageNames = storeImageStr.split("\\|");
				    dto.setStoreImageName(imageNames[1]);
				} else {
				    dto.setStoreImageName("none.jpg");
				}
				
				// change to Date type(resDate + resTime)
			    try {
			        String dateStr = dto.getResDate() + " " + dto.getResTime();
			        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm");
			        Date reservationDateTime = sdf.parse(dateStr);
			        dto.setReservationDateTime(reservationDateTime);
			    } catch (Exception e) {
			    	System.out.println("ReservationDateTime is not confirmed");
			        e.printStackTrace();
			    }
				
				list.add(dto);
			}
		} catch (Exception e) {
			e.printStackTrace();
			System.out.println("getSelectAll is failed");
		} finally {
			DB.dbConnClose(rs, pstmt, conn);
		}
		return list;
	}
	
	public ReservationDTO getSelectOne(ReservationDTO dtoPm) {
		ReservationDTO dto = null;
		try {
			conn = DB.dbConn();
			String sql = "SELECT r.ResNo, r.MemberNo, r.StoreNo, r.ResComment, r.ResDate, r.ResTime, "
					+ "r.ResPeople, r.ResRegidate, r.ResUpdate, r.ChangeReason, s.StoreImage AS StoreImageName, s.StoreName AS StoreName "
					+ "FROM Reservation r JOIN Store s ON r.StoreNo = s.StoreNo "
					+ "WHERE r.ResNo = ? ORDER BY ResDate DESC";
			pstmt = conn.prepareStatement(sql);
			pstmt.setInt(1, dtoPm.getResNo());
			rs = pstmt.executeQuery();
			if (rs.next()) {
				dto = new ReservationDTO();
				dto.setResNo(rs.getInt("ResNo"));
				dto.setMemberNo(rs.getInt("MemberNo"));
				dto.setStoreNo(rs.getInt("StoreNo"));
				dto.setResComment(rs.getString("ResComment"));
				dto.setResDate(rs.getString("ResDate"));
				dto.setResTime(rs.getString("ResTime"));
				dto.setResPeople(rs.getString("ResPeople"));
				dto.setResRegidate(rs.getDate("ResRegidate"));
				dto.setResUpdate(rs.getDate("ResUpdate"));
				dto.setStoreName(rs.getString("StoreName"));
				dto.setChangeReason(rs.getString("ChangeReason"));
				
				// split ImageName
				String storeImageStr = rs.getString("StoreImageName");
				if (storeImageStr != null && storeImageStr.contains("|")) {
				    String[] imageNames = storeImageStr.split("\\|");
				    dto.setStoreImageName(imageNames[1]);
				} else {
				    dto.setStoreImageName("none.jpg");
				}
				
				// change to Date type(resDate + resTime)
			    try {
			        String dateStr = dto.getResDate() + " " + dto.getResTime();
			        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm");
			        Date reservationDateTime = sdf.parse(dateStr);
			        dto.setReservationDateTime(reservationDateTime);
			    } catch (Exception e) {
			    	System.out.println("ReservationDateTime(SelectOne) is not confirmed");
			        e.printStackTrace();
			    }
			}
		} catch (Exception e) {
			e.printStackTrace();
			System.out.println("getSelectOne is failed");
		} finally {
			DB.dbConnClose(rs, pstmt, conn);
		}
		return dto;
	}
	
	public int setUpdate(ReservationDTO dtoPm) {
		int result = 0;
		try {
			conn = DB.dbConn();
			String sql = "UPDATE RESERVATION SET ResComment = ?, ResDate = ?, ResTime = ?, "
					+ "ResPeople = ?, ChangeReason = ?, ResUpdate = SYSDATE WHERE ResNo = ?";
			pstmt = conn.prepareStatement(sql);
			pstmt.setString(1, dtoPm.getResComment());
			pstmt.setString(2, dtoPm.getResDate());
			pstmt.setString(3, dtoPm.getResTime());
			pstmt.setString(4, dtoPm.getResPeople());
			pstmt.setString(5, dtoPm.getChangeReason());
			pstmt.setInt(6, dtoPm.getResNo());
			result = pstmt.executeUpdate();
		} catch (Exception e) {
			result = 0;
		} finally {
			DB.dbConnClose(rs, pstmt, conn);
		}
		return result;
	}
	
	public int setDelete(ReservationDTO dtoPm) {
		int result = 0;
		try {
			conn = DB.dbConn();
			String sql = "DELETE FROM RESERVATION WHERE ResNo = ?";
			pstmt = conn.prepareStatement(sql);
			pstmt.setInt(1, dtoPm.getResNo());
			result = pstmt.executeUpdate();
		} catch (Exception e) {
			result = 0;
		} finally {
			DB.dbConnClose(rs, pstmt, conn);
		}
		return result;
	}
	
	// ReviewList
	public List<ReviewDTO> getSelectAllReview(ReviewDTO dtoPm) {
		List<ReviewDTO> list = new ArrayList<>();
		try {
			conn = DB.dbConn();
			String sql = "SELECT ReviewNo, ReviewTitle, ReviewContent, ReviewEstimation, ReviewRecommendation, "
					+ "ReviewImage, ReviewRegidate, ReviewUpdate, R.StoreNo, StoreImage, "
					+ "StoreName, StoreCategory, StoreAddr, StoreStreetAddr "
					+ "FROM REVIEW R INNER JOIN STORE S ON R.StoreNo = S.StoreNo "
					+ "WHERE R.MemberNo = ? ORDER BY ReviewRegidate DESC";
			pstmt = conn.prepareStatement(sql);
			pstmt.setInt(1, dtoPm.getMemberNo());
			rs = pstmt.executeQuery();
			while (rs.next()) {
				ReviewDTO dto = new ReviewDTO();
				dto.setReviewNo(rs.getInt("ReviewNo"));
				dto.setReviewTitle(rs.getString("ReviewTitle"));
				dto.setReviewContent(rs.getString("ReviewContent"));
				dto.setReviewEstimation(rs.getInt("ReviewEstimation"));
				dto.setReviewRecommendation(rs.getInt("ReviewRecommendation"));
				dto.setReviewImage(rs.getString("ReviewImage"));
				dto.setReviewRegidate(rs.getDate("ReviewRegidate"));
				dto.setReviewUpdate(rs.getDate("ReviewUpdate"));
				dto.setStoreNo(rs.getInt("StoreNo"));
				
				StoreDTO dtoStore = new StoreDTO();
				dtoStore.setStoreNo(rs.getInt("StoreNo"));
				dtoStore.setStoreName(rs.getString("StoreName"));
				dtoStore.setStoreCategory(rs.getString("StoreCategory"));
				dtoStore.setStoreAddr(rs.getString("StoreAddr"));
				dtoStore.setStoreStreetAddr(rs.getString("StoreStreetAddr"));
				dtoStore.setStoreImage(rs.getString("StoreImage"));
				
				dto.setStore(dtoStore);
				list.add(dto);
			}
		} catch (Exception e) {
			System.out.println("getSelectAll is failed");
		} finally {
			DB.dbConnClose(rs, pstmt, conn);
		}
		return list;
	}
	
	// WishList
	public List<WishListDTO> getSelectAllWish(WishListDTO dtoPm) {
		List<WishListDTO> list = new ArrayList<>();
		try {
			conn = DB.dbConn();
			String sql = "SELECT W.MemberNo, W.WishNo, W.StoreNo AS WishListStoreNo, S.StoreNo AS StoreStoreNo, "
			        + "S.MemberNo AS StoreMemberNo, S.StoreCategory, S.StoreName, S.OfficeName, S.StoreContact, "
			        + "S.StorePostalCode, S.StoreAddr, S.StoreStreetAddr, S.StoreAdditionalInfo, S.StoreBusinessNum, "
			        + "S.StoreImage, S.StoreSchedule, S.StoreComment, S.StoreFacilities, S.StoreRegidate, S.StoreUpdate, "
			        + "AVG(R.ReviewEstimation) AS ReviewEstimation, COUNT(R.ReviewEstimation) AS ReviewCount "
			        + "FROM WishList W INNER JOIN Store S ON W.StoreNo = S.StoreNo LEFT JOIN Review R ON W.StoreNo = R.StoreNo "
			        + "WHERE W.MemberNo = ? "
			        + "GROUP BY W.MemberNo, W.WishNo, W.StoreNo, S.StoreNo, S.MemberNo, "
			        + "S.StoreCategory, S.StoreName, S.OfficeName, S.StoreContact, S.StorePostalCode, S.StoreAddr, "
			        + "S.StoreStreetAddr, S.StoreAdditionalInfo, S.StoreBusinessNum, S.StoreImage, S.StoreSchedule, "
			        + "S.StoreComment, S.StoreFacilities, S.StoreRegidate, S.StoreUpdate "
			        + "ORDER BY W.WishNo DESC";
			pstmt = conn.prepareStatement(sql);
			pstmt.setInt(1, dtoPm.getMemberNo());
			rs = pstmt.executeQuery();
			while (rs.next()) {
				WishListDTO dto = new WishListDTO();
				dto.setMemberNo(dtoPm.getMemberNo());
				dto.setWishNo(rs.getInt("WishNo"));
				dto.setStoreNo(rs.getInt("WishListStoreNo"));
				
				StoreDTO dtoStore = new StoreDTO();
				dtoStore.setStoreCategory(rs.getString("StoreCategory"));
				dtoStore.setStoreName(rs.getString("StoreName"));
				dtoStore.setStoreAddr(rs.getString("StoreAddr"));
				dtoStore.setStoreFacilities(rs.getString("StoreFacilities"));
				dtoStore.setStoreImage(rs.getString("StoreImage"));
				
				ReviewDTO dtoReview = new ReviewDTO();
				dtoReview.setReviewCount(rs.getInt("ReviewCount"));
				dtoReview.setReviewEstimation(rs.getFloat("ReviewEstimation"));
				
				dto.setStore(dtoStore);
				dto.setReview(dtoReview);
				list.add(dto);
			}
		} catch (Exception e) {
			System.out.println("WishList getSelectAll fail");
			e.printStackTrace();
		} finally {
			DB.dbConnClose(rs, pstmt, conn);
		}
		return list;
	}
	
	public WishListDTO getSelectOne(WishListDTO dtoPm) {
		WishListDTO dto  = new WishListDTO();
		try {
			conn = DB.dbConn();
			String sql = "SELECT WishNo FROM WishList WHERE StoreNo = ? AND MemberNo = ?";
			pstmt = conn.prepareStatement(sql);
			pstmt.setInt(1, dtoPm.getStoreNo());
			pstmt.setInt(2, dtoPm.getMemberNo());
			rs = pstmt.executeQuery();
			if (rs.next()) {
				dto.setStoreNo(dtoPm.getStoreNo());
				dto.setMemberNo(dtoPm.getMemberNo());
				dto.setWishNo(rs.getInt("WishNo"));
			}
		} catch (Exception e) {
			System.out.println("WishList getSelectOne fail");
		} finally {
			DB.dbConnClose(rs, pstmt, conn);
		}
		return dto;
	}
	
	public int setInsert(WishListDTO dtoPm) {
		int result = 0;
		try {
			conn = DB.dbConn();
			String sql = "INSERT INTO WishList (WishNo, StoreNo, MemberNo) "
					+ "VALUES (SEQ_WISHNO.NEXTVAL, ?, ?)";
			pstmt = conn.prepareStatement(sql);
			pstmt.setInt(1, dtoPm.getStoreNo());
			pstmt.setInt(2, dtoPm.getMemberNo());
			result = pstmt.executeUpdate();
		} catch (Exception e) {
			result = 0;
			e.printStackTrace();
		} finally {
			DB.dbConnClose(rs, pstmt, conn);
		}
		return result;
	}
	
	public int setDelete(WishListDTO dtoPm) {
		int result = 0;
		try {
			conn = DB.dbConn();
			String sql = "DELETE FROM WishList WHERE StoreNo = ? AND MemberNo = ?";
			pstmt = conn.prepareStatement(sql);
			pstmt.setInt(1, dtoPm.getStoreNo());
			pstmt.setInt(2, dtoPm.getMemberNo());
			result = pstmt.executeUpdate();
		} catch (Exception e) {
			result = 0;
		} finally {
			DB.dbConnClose(rs, pstmt, conn);
		}
		return result;
	}
	
	// StoreList
	public List<StoreDTO> getSelectOne(StoreDTO dtoPm) {
		List<StoreDTO> list = new ArrayList<>();
		try {
			conn = DB.dbConn();
			String sql = "SELECT S.StoreNo, StoreCategory, StoreName, OfficeName, StoreContact, StorePostalCode, "
					+ "StoreAddr, StoreStreetAddr, StoreAdditionalInfo, StoreBusinessNum, StoreImage, StoreSchedule, "
					+ "StoreComment, StoreFacilities, StoreRegidate, StoreUpdate, "
					+ "(SELECT COUNT(*) FROM Review R WHERE S.StoreNo = R.StoreNo) AS ReviewCount, "
					+ "(SELECT AVG(ReviewEstimation) FROM Review R WHERE S.StoreNo = R.StoreNo) AS ReviewEstimation "
					+ "FROM STORE S WHERE MemberNo = ?";
			pstmt = conn.prepareStatement(sql);
			pstmt.setInt(1, dtoPm.getMemberNo());
			rs = pstmt.executeQuery();
			if (rs.next()) {
				StoreDTO dto  = new StoreDTO();
				dto.setStoreNo(rs.getInt("StoreNo"));
				dto.setMemberNo(dtoPm.getMemberNo());
				dto.setStoreCategory(rs.getString("StoreCategory"));
				dto.setStoreName(rs.getString("StoreName"));
				dto.setOfficeName(rs.getString("OfficeName"));
				dto.setStoreContact(rs.getString("StoreContact"));
				dto.setStorePostalCode(rs.getString("StorePostalCode"));
				dto.setStoreAddr(rs.getString("StoreAddr"));
				dto.setStoreStreetAddr(rs.getString("StoreStreetAddr"));
				dto.setStoreAdditionalInfo(rs.getString("StoreAdditionalInfo"));
				dto.setStoreBusinessNum(rs.getString("StoreBusinessNum"));
				dto.setStoreImage(rs.getString("StoreImage"));
				dto.setStoreSchedule(rs.getString("StoreSchedule"));
				dto.setStoreComment(rs.getString("StoreComment"));
				dto.setStoreFacilities(rs.getString("StoreFacilities"));
				dto.setStoreRegidate(rs.getDate("StoreRegidate"));
				dto.setStoreUpdate(rs.getDate("StoreUpdate"));
				
				ReviewDTO dtoReview = new ReviewDTO();
				dtoReview.setReviewCount(rs.getInt("ReviewCount"));
				dtoReview.setReviewEstimation(rs.getFloat("ReviewEstimation"));
				
				dto.setReview(dtoReview);
				
				list.add(dto);
			}
		} catch (Exception e) {
			System.out.println("Store getSelectOne fail");
		} finally {
			DB.dbConnClose(rs, pstmt, conn);
		}
		return list;
	}
}
