package admin.Class;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import admin.controller.AdminCommand;
import admin.dao.AdminDAO;
import mypage.dto.InquiryDTO;

public class Admin_homeEdit implements AdminCommand {
	public void execute(HttpServletRequest request, HttpServletResponse response, String path) throws ServletException, IOException {
		int InquiryNo = Integer.parseInt(request.getParameter("InquiryNo"));
		
		InquiryDTO dtoAg = new InquiryDTO();
		dtoAg.setInquiryNo(InquiryNo);
		
		AdminDAO dao = new AdminDAO();
		int result = dao.setChecked(dtoAg);
    	
		if (result > 0) {
            System.out.println("InquiryEdit success");
            response.sendRedirect(path + "/Admin_servlet/admin_home.do");
        } else {
            System.out.println("InquiryEdit fail");
            response.sendRedirect(path + "/Admin_servlet/admin_home.do");
        }
    }
}