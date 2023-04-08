import math


class PaginationUtil:
    @staticmethod
    def has_pagination(request, totalItem, page_size):
        currentPage = int(request.GET.get("page", 1))
        path = request.META.get("PATH_INFO")
        paginations = {}
        paginations["page_size"] = page_size
        if paginations["page_size"] > 0:
            paginations["total_page"] = math.ceil(totalItem / paginations["page_size"])
            paginations["current_page"] = int(currentPage)

            paginations["link"] = {}
            if paginations["current_page"] < paginations["total_page"]:
                paginations["link"]["next"] = "{}?page={}".format(
                    path, paginations["current_page"] + 1
                )
            else:
                paginations["link"]["next"] = ""

            if paginations["current_page"] > 1:
                paginations["link"]["prev"] = "{}?page={}".format(
                    path, paginations["current_page"] - 1
                )
            else:
                paginations["link"]["prev"] = ""

            paginations["extra"] = {}
        else:
            paginations = PaginationUtil.no_pagination()

        return paginations

    @staticmethod
    def no_pagination():
        paginations = {}
        paginations["page_size"] = 0
        paginations["total_page"] = 0
        paginations["current_page"] = 1
        paginations["link"] = {}
        paginations["link"]["next"] = "null"
        paginations["link"]["prev"] = "null"
        paginations["extra"] = ""

        return paginations
