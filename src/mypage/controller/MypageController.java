package mypage.controller;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import mypage.Class.*;

@WebServlet("/Mypage_servlet/*")
public class MypageController extends HttpServlet {
    private static final long serialVersionUID = 1L;
    private Map<String, MypageCommand> commandMap = new HashMap<>();

    @Override
    public void init() throws ServletException {
        commandMap.put("changeInfo.do", new ChangeInfo());
        commandMap.put("changeInfoProc.do", new ChangeInfoProc());
        commandMap.put("changeInfoRemove.do", new ChangeInfoRemove());
        commandMap.put("storeList.do", new StoreList());
        commandMap.put("reservationInfo.do", new ReservationList());
        commandMap.put("reservationInfoUpdate.do", new ReservationEdit());
        commandMap.put("reservationInfoUpdateProc.do", new ReservationEditProc());
        commandMap.put("reservationInfoDeleteProc.do", new ReservationRemove());
        commandMap.put("reviewList.do", new ReviewList());
        commandMap.put("visitList.do", new VisitList());
        commandMap.put("wishList.do", new WishList());
        commandMap.put("wishAdd.do", new WishAdd());
        commandMap.put("wishRemove.do", new WishRemove());
        commandMap.put("inquiryAdd.do", new InquiryAdd());
        commandMap.put("inquiryList.do", new InquiryList());
        commandMap.put("memberShip.do", new MemberShip());
        commandMap.put("memberShipAdd.do", new MemberShipAdd());
    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        request.setCharacterEncoding("UTF-8");

        String path = request.getContextPath();
        String url = request.getRequestURL().toString();
        String action = extractAction(url);

        request.setAttribute("path", path);

        MypageCommand command = commandMap.get(action);
        if (command != null) {
            command.execute(request, response, path);
        } else {
            System.out.println("== Mypage Controller Contains None ==");
        }
    }

    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        doGet(request, response);
    }

    private String extractAction(String url) {
        int idx = url.lastIndexOf("/");
        return idx >= 0 ? url.substring(idx + 1) : "";
    }
}

