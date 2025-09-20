package home.dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.List;

import config.DB;
import member.dto.MemberDTO;
import store.dto.ReviewDTO;
import store.dto.StoreDTO;

public class HomeDAO {
	Connection conn = null;
	PreparedStatement pstmt = null;
	ResultSet rs = null;
	
	// Recommendation
	public List<StoreDTO> getSelectRank() {
		List<StoreDTO> list = new ArrayList<>();
		try {
			conn = DB.dbConn();
			String sql = "WITH ReviewStats AS ("
					+ "SELECT StoreNo, COUNT(*) AS ReviewCount, AVG(ReviewEstimation) AS ReviewEstimation, RANK() OVER (ORDER BY COUNT(*) DESC) AS Rank "
					+ "FROM Review "
					+ "WHERE ReviewRegidate BETWEEN SYSDATE - 7 AND SYSDATE "
					+ "GROUP BY StoreNo) "
					+ "SELECT R.StoreNo, S.StoreName, S.StoreCategory, S.StoreAddr, S.StoreImage, R.ReviewCount, R.ReviewEstimation, R.Rank "
					+ "FROM ReviewStats R "
					+ "JOIN Store S ON R.StoreNo = S.StoreNo "
					+ "WHERE R.Rank <= 15 ORDER BY R.Rank";
			pstmt = conn.prepareStatement(sql);
			rs = pstmt.executeQuery();
			while (rs.next()) {
				StoreDTO dto = new StoreDTO();
				dto.setStoreNo(rs.getInt("StoreNo"));
				dto.setStoreName(rs.getString("StoreName"));
				dto.setStoreCategory(rs.getString("StoreCategory"));
				dto.setStoreAddr(rs.getString("StoreAddr"));
				dto.setStoreImage(rs.getString("StoreImage"));
				
				ReviewDTO dtoReview = new ReviewDTO();
				dtoReview.setReviewCount(rs.getInt("ReviewCount"));
				dtoReview.setReviewEstimation(rs.getFloat("ReviewEstimation"));
				
				dto.setReview(dtoReview);
				list.add(dto);
			}
		} catch (Exception e) {
			System.out.println("Store getSelectAll fail");
		} finally {
			DB.dbConnClose(rs, pstmt, conn);
		}
		return list;
	}
	
	// Category-All
	public List<StoreDTO> getSelectCategory() {
		List<StoreDTO> list = new ArrayList<>();
		try {
			conn = DB.dbConn();
			String sql = "SELECT S.*, "
					+ "(SELECT AVG(TO_NUMBER(MenuPrice)) FROM Menu M WHERE S.StoreNo = M.StoreNo) AS MenuPrice, "
					+ "(SELECT COUNT(*) FROM Review R WHERE S.StoreNo = R.StoreNo) AS ReviewCount, "
					+ "(SELECT AVG(ReviewEstimation) FROM Review R WHERE S.StoreNo = R.StoreNo) AS ReviewEstimation "
					+ "FROM Store S ORDER BY StoreNo DESC";
			pstmt = conn.prepareStatement(sql);
			rs = pstmt.executeQuery();
			while (rs.next()) {
				StoreDTO dto = new StoreDTO();
				dto.setStoreNo(rs.getInt("StoreNo"));
				dto.setMemberNo(rs.getInt("MemberNo"));
				dto.setStoreName(rs.getString("StoreName"));
				dto.setStoreCategory(rs.getString("StoreCategory"));
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
			System.out.println("Store getSelectAll fail");
		} finally {
			DB.dbConnClose(rs, pstmt, conn);
		}
		return list;
	}
	
	// Review
	public List<ReviewDTO> getSelectReview() {
	    List<ReviewDTO> list = new ArrayList<>();
	    try {
	        conn = DB.dbConn();
	        String sql = "SELECT * FROM (" +
	                    "SELECT R.ReviewNo, M.MemberNo, M.MemberImage, M.MemberNickname, " +
	                    "R.ReviewEstimation, R.ReviewRecommendation, R.ReviewImage, " +
	                    "R.ReviewTitle, R.ReviewContent, R.ReviewRegidate, R.StoreNo " +
	                    "FROM Review R JOIN Member M ON R.MemberNo = M.MemberNo " +
	                    "ORDER BY R.ReviewRecommendation DESC" +
	                    ") WHERE ROWNUM <= 2";
	        
	        pstmt = conn.prepareStatement(sql);
	        rs = pstmt.executeQuery();
	        
	        while (rs.next()) {
	            ReviewDTO dto = new ReviewDTO();
	            dto.setReviewNo(rs.getInt("ReviewNo"));
	            dto.setReviewEstimation(rs.getFloat("ReviewEstimation"));
	            dto.setReviewRecommendation(rs.getInt("ReviewRecommendation"));
	            dto.setReviewImage(rs.getString("ReviewImage"));
	            dto.setReviewTitle(rs.getString("ReviewTitle"));
	            dto.setReviewContent(rs.getString("ReviewContent"));
	            dto.setReviewRegidate(rs.getDate("ReviewRegidate"));
	            dto.setStoreNo(rs.getInt("StoreNo"));
	            
	            MemberDTO dtoMember = new MemberDTO();
	            dtoMember.setMemberNo(rs.getInt("MemberNo"));
	            dtoMember.setMemberImage(rs.getString("MemberImage"));
	            dtoMember.setMemberNickname(rs.getString("MemberNickname"));
	            
	            dto.setMember(dtoMember);
	            list.add(dto);
	        }
	    } catch (Exception e) {
	        System.out.println("Review getSelectReview fail: " + e.getMessage());
	        e.printStackTrace();
	    } finally {
	        DB.dbConnClose(rs, pstmt, conn);
	    }
	    return list;
	}
}
