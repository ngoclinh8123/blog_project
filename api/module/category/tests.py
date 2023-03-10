from django.urls import reverse
from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.test import APITestCase
from module.category.models import Category
from util.test_user_account_util import TestUserAccountUtil


class CategoryTests(APITestCase):
    def setUp(self):
        self.category1 = Category.objects.create(title="Parent category", parent_id=0)
        self.category2 = Category.objects.create(
            title="Child category", parent_id=self.category1.id
        )

        User = get_user_model()

        # create non superuser
        self.user = TestUserAccountUtil.create_user()

        # create superuser
        self.superuser = TestUserAccountUtil.create_super_user()

    def test_category_string_representation(self):
        category = Category.objects.get(id=self.category1.id)
        self.assertEqual(str(category), f"{category.id} - {category.title} - {category.parent_id}")

    def test_retrieve_view_category(self):
        url = reverse("category_detail", args=[self.category1.id])
        response = self.client.get(url, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["data"]["title"], "Parent category")

    def test_list_view_categories(self):
        url = reverse("category_list")
        response = self.client.get(url, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(Category.objects.all().count(), 2)

    def test_create_category(self):
        url = reverse("category_list")
        data = {"title": "New category", "parent_id": 0}

        # case token not provided
        response = self.client.post(url, data, format="json")
        self.assertEqual(response.status_code, 401)
        self.assertEqual(Category.objects.all().count(), 2)

        # case user is non superuser
        self.client.force_authenticate(user=self.user)
        response = self.client.post(url, data, format="json")
        self.assertEqual(response.status_code, 403)
        self.assertEqual(Category.objects.all().count(), 2)

        # case user is superuser
        self.client.force_authenticate(user=self.superuser)
        response = self.client.post(url, data, format="json")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(Category.objects.all().count(), 3)

    def test_change_category(self):
        url = reverse("category_detail", args=[self.category1.id])
        data = {"title": "Category 1", "parent id": 0}

        # case token not provided
        response = self.client.put(url, data, format="json")
        self.assertEqual(response.status_code, 401)

        # case user is non superuser
        self.client.force_authenticate(user=self.user)
        response = self.client.put(url, data, format="json")
        self.assertEqual(response.status_code, 403)

        # case user is superuser
        self.client.force_authenticate(user=self.superuser)
        response = self.client.put(url, data, format="json")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(Category.objects.get(id=self.category1.id).title, "Category 1")

    def test_delete_category(self):
        url = reverse("category_detail", args=[self.category1.id])

        # case token not provided
        response = self.client.delete(url)
        self.assertEqual(response.status_code, 401)

        # case user is non superuser
        self.client.force_authenticate(user=self.user)
        response = self.client.delete(url)
        self.assertEqual(response.status_code, 403)

        # case user is superuser
        self.client.force_authenticate(user=self.superuser)
        response = self.client.delete(url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(Category.objects.all().count(), 0)
