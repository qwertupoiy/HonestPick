package admin.Class;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import admin.controller.AdminCommand;
import admin.dao.AdminDAO;
import admin.dto.AdvertisementDTO;

public class Admin_ads_delete implements AdminCommand {
	public void execute(HttpServletRequest request, HttpServletResponse response, String path) throws ServletException, IOException {
		int adNo = Integer.parseInt(request.getParameter("adNo"));
		
		AdvertisementDTO dtoPm = new AdvertisementDTO();
		dtoPm.setAdNo(adNo);
		
		AdminDAO dao = new AdminDAO();
		
		int result = dao.setDelete(dtoPm);
		
		// 결과 처리
		HttpSession session = request.getSession();
        if (result > 0) {
            System.out.println("Advertisement Delete Success");
            session.setAttribute("alertMsg", "광고가 삭제되었습니다.");
            response.sendRedirect(path + "/Admin_servlet/admin_ads.do");
        } else {
            System.out.println("Advertisement Delete Fail");
            session.setAttribute("alertMsg", "광고 삭제에 실패하였습니다.");
            response.sendRedirect(path + "/Admin_servlet/admin_ads_delete.do?adNo=" + adNo);
        }
    }
}
