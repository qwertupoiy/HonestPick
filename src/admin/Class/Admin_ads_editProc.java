package admin.Class;

import java.io.File;
import java.io.IOException;
import java.sql.Date;
import java.time.LocalDate;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import com.oreilly.servlet.MultipartRequest;
import com.oreilly.servlet.multipart.DefaultFileRenamePolicy;

import admin.controller.AdminCommand;
import admin.dao.AdminDAO;
import admin.dto.AdvertisementDTO;

public class Admin_ads_editProc implements AdminCommand {
	public void execute(HttpServletRequest request, HttpServletResponse response, String path) throws ServletException, IOException {
		String attachPath = "C:/hp/attach" + request.getContextPath();
		String uploadPath = attachPath + "/product";
		int max_upload = 10 * 1024 * 1024; // 10MB까지
		
		// create multi_object's path
		MultipartRequest multi = new MultipartRequest(
			request,
			uploadPath,
			max_upload,
			"utf-8",
			new DefaultFileRenamePolicy()
		);
		
		int adNo = Integer.parseInt(multi.getParameter("adNo"));
		String fileOrgName = multi.getOriginalFileName("adImage");
		String fileName = multi.getFilesystemName("adImage");
		System.out.println("adImage : " + fileOrgName);
		System.out.println("fileName : " + fileName);
		
		String adImageFullName  = "";
		
		// check for uploading
		boolean hasNewFile = (fileOrgName != null && !fileOrgName.isEmpty()
                && fileName    != null && !fileName.isEmpty()
                && !fileOrgName.equals("none.jpg")
                && !fileName.equals("none.jpg"));
		
		// Selecting previous AdImage
		AdvertisementDTO dto = new AdvertisementDTO();
		dto.setAdNo(adNo);
		
		AdminDAO dao = new AdminDAO();
		AdvertisementDTO prevDto = dao.getSelectOne_Ad(dto);
	    String prevImage = prevDto.getAdImage();
	    
	    System.out.println("prevImage : " + prevImage);
	    
	    if (hasNewFile) {
	    	adImageFullName  = fileOrgName + "|" + fileName;
	    } else if(prevImage != null && !prevImage.isEmpty() && !prevImage.equals("")) {
			adImageFullName  = prevImage;
		} else {
			adImageFullName = "none.jpg";
		}
	    
		String adTitle = multi.getParameter("adTitle");
		String adStartDate_ = multi.getParameter("adStartDate");
			Date adStartDate = Date.valueOf(adStartDate_);
		String adEndDate_ = multi.getParameter("adEndDate");
			Date adEndDate = Date.valueOf(adEndDate_);

		// set about check_finish
		LocalDate today = LocalDate.now();
		LocalDate endDate = adEndDate.toLocalDate();
		
		String check_finish = "";
		if(!today.isBefore(endDate)) {
			check_finish = "finish";
		}
		
		String description = multi.getParameter("description");
		
		// change type of period
		String how_long_ = multi.getParameter("adPeriod");
		int how_long = 0;
		try {
			if(how_long_ != null && !how_long_.isEmpty()) {
				how_long = Integer.parseInt(how_long_);
				switch (how_long) {
					case 0: how_long = 0; break;
					case 1: how_long = 1; break;
					case 2: how_long = 7; break;
					case 3: how_long = 30; break;
					case 4: how_long = 365; break;
					default:
						System.out.println("You didn't choose your ad's periods");
						return;
				}
				System.out.println("ad_period : " + how_long + "days");
			}
		} catch(Exception e) {
			e.printStackTrace();
			System.out.println("period is not inserted");
		}
		
		// set DTO
		dto.setAdNo(adNo);
		dto.setAdTitle(adTitle);
		dto.setAdImage(adImageFullName );
		dto.setAdStartDate(adStartDate);
		dto.setAdEndDate(adEndDate);
		dto.setPeriod(how_long);
		dto.setDescription(description);
		dto.setCheck_finish(check_finish);
		
		HttpSession session = request.getSession();
		
		int result = dao.setUpdate(dto);
		
		if (result > 0) {
	        if (hasNewFile && prevImage != null && !prevImage.equals("none.jpg")) {
	            String[] parts = prevDto.getAdImage().split("\\|");
	            if (parts.length > 1) {
	            	/* our lecture's source
	                java.io.File deleteFile = new java.io.File(uploadPath + "/" + parts[1]);
	                if (deleteFile.exists()) {
	                    deleteFile.delete();
	                */
            		File oldFile = new File(uploadPath, parts[1]);
            		if(oldFile.exists() && oldFile.delete()) {
            			System.out.println("File is completely deleted");
	                } else {
	                    System.out.println("FileDelete Fail (File not found)");
	                }
	            }
	        }
	        
	        // create session of message
            session.setAttribute("alertMsg", "광고가 수정되었습니다.");
		    response.sendRedirect(path + "/Admin_servlet/admin_ads.do");
		} else {
            System.out.println("Ads Edit Fail");
            session.setAttribute("alertMsg", "광고가 수정에 실패하였습니다.");
            response.sendRedirect(path + "/Admin_servlet/admin_ads_edit.do?adNo=" + adNo);
        }
	}
}
