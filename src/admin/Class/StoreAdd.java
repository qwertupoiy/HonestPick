package admin.Class;

import java.io.IOException;

import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import com.oreilly.servlet.MultipartRequest;
import com.oreilly.servlet.multipart.DefaultFileRenamePolicy;

import admin.controller.AdminCommand;
import store.dao.StoreDAO;
import store.dto.StoreDTO;

public class StoreAdd implements AdminCommand {
    private String page;

    public StoreAdd(String page) {
        this.page = page;
    }

    @Override
    public void execute(HttpServletRequest request, HttpServletResponse response, String path) throws ServletException, IOException {
        if ("show".equals(page)) {process(request, response);}
        else if ("handle".equals(page)) {processProc(request, response, path);}
    }

    private void process(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        int MemberNo = Integer.parseInt(request.getParameter("MemberNo"));
        request.setAttribute("MemberNo", MemberNo);
        RequestDispatcher rd = request.getRequestDispatcher("/WEB-INF/page/admin/storeAdd.jsp");
        rd.forward(request, response);
    }

    private void processProc(HttpServletRequest request, HttpServletResponse response, String path) throws ServletException, IOException {
        String attachPath = "C:/hp/attach" + request.getContextPath();
        String uploadPath = attachPath + "/product";
        int max_upload = 10 * 1024 * 1024;

        MultipartRequest multi = new MultipartRequest(
            request,
            uploadPath,
            max_upload,
            "utf-8",
            new DefaultFileRenamePolicy()
        );

        String fileOrgName = multi.getOriginalFileName("StoreImage");
        String fileName = multi.getFilesystemName("StoreImage");
        String StoreImage = (fileOrgName == null || fileName == null) ? "-" : fileOrgName + "|" + fileName;

        int MemberNo = Integer.parseInt(multi.getParameter("MemberNo"));
        String StoreCategory = multi.getParameter("StoreCategory");
        String StoreName = multi.getParameter("StoreName");
        String OfficeName = multi.getParameter("OfficeName");
        String StoreContact = multi.getParameter("StoreContact");
        String StorePostalCode = multi.getParameter("StorePostalCode");
        String StoreAddr = multi.getParameter("StoreAddr");
        String StoreStreetAddr = multi.getParameter("StoreStreetAddr");
        String StoreAdditionalInfo = multi.getParameter("StoreAdditionalInfo");
        String StoreBusinessNum = multi.getParameter("StoreBusinessNum");
        String StoreComment = multi.getParameter("StoreComment");
        String StoreFacilities = multi.getParameter("StoreFacilities");
        String StoreSchedule = multi.getParameter("StoreSchedule");

        StoreDTO dtoag = new StoreDTO();
        dtoag.setStoreImage(StoreImage);
        dtoag.setMemberNo(MemberNo);
        dtoag.setStoreCategory(StoreCategory);
        dtoag.setStoreName(StoreName);
        dtoag.setOfficeName(OfficeName);
        dtoag.setStoreContact(StoreContact);
        dtoag.setStorePostalCode(StorePostalCode);
        dtoag.setStoreAddr(StoreAddr);
        dtoag.setStoreStreetAddr(StoreStreetAddr);
        dtoag.setStoreAdditionalInfo(StoreAdditionalInfo);
        dtoag.setStoreBusinessNum(StoreBusinessNum);
        dtoag.setStoreSchedule(StoreSchedule);
        dtoag.setStoreComment(StoreComment);
        dtoag.setStoreFacilities(StoreFacilities);

        StoreDAO dao = new StoreDAO();
        int result = dao.setInsert(dtoag);

        HttpSession session = request.getSession();
        if (result > 0) {
            System.out.println("Store storeAdd Success");
            session.setAttribute("alertMsg", "매장이 등록되었습니다.");
            response.sendRedirect(path + "/Store_servlet/storeList.do");
        } else {
            System.out.println("Store storeAdd Fail");
            session.setAttribute("alertMsg", "매장 등록에 실패하였습니다.");
            response.sendRedirect(path + "/Admin_servlet/storeAdd.do");
        }
    }
}
